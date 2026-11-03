import { memoriesConfigured, signedFileUrl } from "@/lib/memories";

/** Redirects to a short-lived signed Storage URL for one gallery photo or voice note (private bucket). */
export async function GET(_req: Request, ctx: RouteContext<"/api/wedding-memories/files/[folderId]/[name]">) {
  if (!memoriesConfigured()) return new Response("Not configured", { status: 503 });
  const { folderId, name } = await ctx.params;
  const url = await signedFileUrl(folderId, name);
  if (!url) return new Response("Not found", { status: 404 });
  return new Response(null, {
    status: 302,
    // The signed URL lasts an hour; let the browser reuse the redirect for 30 minutes.
    headers: { Location: url, "Cache-Control": "private, max-age=1800" },
  });
}
