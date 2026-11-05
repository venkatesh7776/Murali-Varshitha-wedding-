import "server-only";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * READ-ONLY access to the Wedding Memories data owned by the QR photo app
 * (~/Desktop/qr feature, schema in its supabase/migrations). That app is the source of truth:
 * it creates folders, prints QR codes and stores guest uploads. This site never writes —
 * it only selects rows and signs short-lived download URLs. Reactions are shown, never added.
 *
 * The tables have RLS enabled with no policies (the anon key can read nothing), so — exactly
 * like the QR app — we read on the server with the service-role key. It lives only in the
 * server-side env vars SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY and never reaches the browser.
 *
 * Photos and voice notes live in Cloudflare R2 when R2_ACCOUNT_ID, R2_ACCESS_KEY_ID,
 * R2_SECRET_ACCESS_KEY and R2_BUCKET are set (same `<folderId>/<name>` keys as before);
 * otherwise in the Supabase Storage bucket. Only the records stay in Supabase either way.
 *
 * The Supabase project holds a single wedding (there is no wedding_id column), so every folder
 * in it belongs to this invitation.
 */

const BUCKET = "memories";
const SIGNED_URL_SECONDS = 60 * 60;

export type MemoryFolder = {
  id: string;
  name: string;
  /** yyyy-mm-dd, when the couple set one */
  date?: string;
  photoCount: number;
  /** Latest uploaded photos (newest first, up to 2), peeking out of the folder card */
  previewUrls: string[];
};

export type MemoryPhoto = {
  id: string;
  url: string;
  guestName?: string;
  source: "guest" | "couple";
  createdAt: string;
  message?: string;
  voiceUrl?: string;
  /** Only reactions people actually gave, most popular first */
  reactions: [emoji: string, count: number][];
};

function supabaseUrl() {
  return process.env.SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}
function serviceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
}

export function memoriesConfigured() {
  return Boolean(supabaseUrl() && serviceKey());
}

let client: SupabaseClient | undefined;
function db() {
  client ??= createClient(supabaseUrl()!, serviceKey()!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

function check<T>({ data, error }: { data: T | null; error: { message: string } | null }): T {
  if (error) throw new Error(`Supabase: ${error.message}`);
  return data as T;
}

/** Ids we generate are [\w-]; reject anything else before it reaches a query or storage path. */
const SAFE_ID = /^[\w-]{1,64}$/;
const SAFE_NAME = /^[\w-]+\.\w+$/;
export const isSafeFolderId = (id: string) => SAFE_ID.test(id);

/** Stable same-origin image URL; the route below redirects to a fresh signed Storage URL. */
const fileUrl = (folderId: string, name: string) => `/api/wedding-memories/files/${folderId}/${name}`;

type SummaryRow = {
  id: string;
  name: string;
  event_date: string | null;
  created_at: string;
  photo_count: number | string;
  preview_names: string[] | null;
};

/** Every event folder, in the order the couple created them, with count and latest photo. */
export async function listMemoryFolders(): Promise<MemoryFolder[]> {
  const rows = check<SummaryRow[]>(
    await db()
      .from("memory_folder_summaries")
      .select("id, name, event_date, created_at, photo_count, preview_names")
      .order("created_at"),
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    date: r.event_date ?? undefined,
    photoCount: Number(r.photo_count) || 0,
    previewUrls: (r.preview_names ?? []).filter((n) => SAFE_NAME.test(n)).map((n) => fileUrl(r.id, n)),
  }));
}

export async function getMemoryFolder(id: string): Promise<Omit<MemoryFolder, "photoCount" | "previewUrls"> | undefined> {
  if (!isSafeFolderId(id)) return undefined;
  const row = check<{ id: string; name: string; event_date: string | null } | null>(
    await db().from("memory_folders").select("id, name, event_date").eq("id", id).maybeSingle(),
  );
  return row ? { id: row.id, name: row.name, date: row.event_date ?? undefined } : undefined;
}

type PhotoRow = {
  id: string;
  photo_name: string;
  guest_name: string | null;
  source: "guest" | "couple";
  created_at: string;
  message: string | null;
  voice_name: string | null;
  reactions: Record<string, unknown> | null;
};

const givenReactions = (r: PhotoRow["reactions"]): [string, number][] =>
  Object.entries(r ?? {})
    .map(([emoji, n]) => [emoji, Number(n)] as [string, number])
    .filter(([emoji, n]) => n > 0 && emoji.length <= 16)
    .sort((a, b) => b[1] - a[1]);

/** Photos in one folder only, newest first, with the guest's note, voice note and reactions. */
export async function listMemoryPhotos(folderId: string): Promise<MemoryPhoto[]> {
  if (!isSafeFolderId(folderId)) return [];
  const rows = check<PhotoRow[]>(
    await db()
      .from("memories")
      .select("id, photo_name, guest_name, source, created_at, message, voice_name, reactions")
      .eq("folder_id", folderId)
      .order("created_at", { ascending: false }),
  );
  return rows
    .filter((r) => SAFE_NAME.test(r.photo_name))
    .map((r) => ({
      id: r.id,
      url: fileUrl(folderId, r.photo_name),
      guestName: r.guest_name ?? undefined,
      source: r.source,
      createdAt: r.created_at,
      message: r.message?.trim() || undefined,
      voiceUrl: r.voice_name && SAFE_NAME.test(r.voice_name) ? fileUrl(folderId, r.voice_name) : undefined,
      reactions: givenReactions(r.reactions),
    }));
}

/**
 * Signed download URL for a photo or voice note that is actually recorded in that folder —
 * so the file route can't be used to read arbitrary objects from the bucket.
 */
export async function signedFileUrl(folderId: string, name: string): Promise<string | undefined> {
  if (!isSafeFolderId(folderId) || !SAFE_NAME.test(name)) return undefined;
  // `name` matches SAFE_NAME ([\w-]+.\w+), so it is safe inside the filter expression.
  const { data: row } = await db()
    .from("memories")
    .select("id")
    .eq("folder_id", folderId)
    .or(`photo_name.eq.${name},voice_name.eq.${name}`)
    .limit(1)
    .maybeSingle();
  if (!row) return undefined;
  const key = `${folderId}/${name}`;
  if (r2Configured()) {
    return getSignedUrl(r2(), new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }), { expiresIn: SIGNED_URL_SECONDS });
  }
  const { data, error } = await db().storage.from(BUCKET).createSignedUrl(key, SIGNED_URL_SECONDS);
  return error || !data ? undefined : data.signedUrl;
}

function r2Configured() {
  return !!(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET);
}

let s3: S3Client | undefined;
function r2() {
  s3 ??= new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
  });
  return s3;
}
