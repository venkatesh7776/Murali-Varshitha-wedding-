import "server-only";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * READ-ONLY access to the Wedding Memories data owned by the QR photo app
 * (~/Desktop/qr feature, schema in its db/schema.sql). That app is the source of truth:
 * it creates folders, prints QR codes and stores guest uploads. This site never writes —
 * it only selects rows and signs short-lived download URLs. Reactions are shown, never added.
 *
 * Everything is on Cloudflare: records in the D1 database (queried through Cloudflare's HTTP
 * API with CLOUDFLARE_API_TOKEN), photos and voice notes in the private R2 bucket. The
 * credentials live only in server-side env vars and never reach the browser.
 *
 * The database holds a single wedding (there is no wedding_id column), so every folder in it
 * belongs to this invitation.
 */

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

const accountId = () => process.env.CLOUDFLARE_ACCOUNT_ID ?? process.env.R2_ACCOUNT_ID;

export function memoriesConfigured() {
  return Boolean(
    accountId() &&
      process.env.D1_DATABASE_ID &&
      process.env.CLOUDFLARE_API_TOKEN &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );
}

/** Runs one read query against D1 and returns its rows. */
async function d1<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId()}/d1/database/${process.env.D1_DATABASE_ID}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { success?: boolean; errors?: { message: string }[]; result?: { results: T[] }[] };
  if (!res.ok || !body.success) throw new Error(`D1: ${body.errors?.[0]?.message ?? `HTTP ${res.status}`}`);
  return body.result?.[0]?.results ?? [];
}

/** Ids we generate are [\w-]; reject anything else before it reaches a query or storage path. */
const SAFE_ID = /^[\w-]{1,64}$/;
const SAFE_NAME = /^[\w-]+\.\w+$/;
export const isSafeFolderId = (id: string) => SAFE_ID.test(id);

/** Stable same-origin image URL; the route below redirects to a fresh signed R2 URL. */
const fileUrl = (folderId: string, name: string) => `/api/wedding-memories/files/${folderId}/${name}`;

type SummaryRow = {
  id: string;
  name: string;
  event_date: string | null;
  created_at: string;
  photo_count: number | string;
  preview_names: string | null; // JSON array
};

/** Every event folder, in the order the couple created them, with count and latest photo. */
export async function listMemoryFolders(): Promise<MemoryFolder[]> {
  const rows = await d1<SummaryRow>(`
    SELECT f.id, f.name, f.event_date, f.created_at,
      (SELECT count(*) FROM memories m WHERE m.folder_id = f.id) AS photo_count,
      (SELECT json_group_array(photo_name) FROM
        (SELECT photo_name FROM memories m WHERE m.folder_id = f.id ORDER BY created_at DESC LIMIT 2)) AS preview_names
    FROM memory_folders f
    ORDER BY f.created_at`);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    date: r.event_date ?? undefined,
    photoCount: Number(r.photo_count) || 0,
    previewUrls: (JSON.parse(r.preview_names ?? "[]") as string[]).filter((n) => SAFE_NAME.test(n)).map((n) => fileUrl(r.id, n)),
  }));
}

export async function getMemoryFolder(id: string): Promise<Omit<MemoryFolder, "photoCount" | "previewUrls"> | undefined> {
  if (!isSafeFolderId(id)) return undefined;
  const [row] = await d1<{ id: string; name: string; event_date: string | null }>("SELECT id, name, event_date FROM memory_folders WHERE id = ?", [id]);
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
  reactions: string | null; // JSON object
};

const givenReactions = (json: PhotoRow["reactions"]): [string, number][] => {
  let r: Record<string, unknown> = {};
  try {
    r = JSON.parse(json ?? "{}") ?? {};
  } catch {}
  return Object.entries(r)
    .map(([emoji, n]) => [emoji, Number(n)] as [string, number])
    .filter(([emoji, n]) => n > 0 && emoji.length <= 16)
    .sort((a, b) => b[1] - a[1]);
};

/** Photos in one folder only, newest first, with the guest's note, voice note and reactions. */
export async function listMemoryPhotos(folderId: string): Promise<MemoryPhoto[]> {
  if (!isSafeFolderId(folderId)) return [];
  const rows = await d1<PhotoRow>(
    "SELECT id, photo_name, guest_name, source, created_at, message, voice_name, reactions FROM memories WHERE folder_id = ? ORDER BY created_at DESC",
    [folderId],
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
  const [row] = await d1<{ id: string }>("SELECT id FROM memories WHERE folder_id = ? AND (photo_name = ? OR voice_name = ?) LIMIT 1", [
    folderId,
    name,
    name,
  ]);
  if (!row) return undefined;
  return getSignedUrl(r2(), new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: `${folderId}/${name}` }), { expiresIn: SIGNED_URL_SECONDS });
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
