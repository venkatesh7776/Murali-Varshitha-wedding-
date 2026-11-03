import { getMemoryFolder, listMemoryPhotos, memoriesConfigured } from "@/lib/memories";

/** Photos of one folder for live refresh on /wedding-memories/[folderId]. Read-only. */
export async function GET(_req: Request, ctx: RouteContext<"/api/wedding-memories/[folderId]">) {
  if (!memoriesConfigured()) return Response.json({ error: "not_configured" }, { status: 503 });
  const { folderId } = await ctx.params;
  try {
    if (!(await getMemoryFolder(folderId))) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ photos: await listMemoryPhotos(folderId) }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("wedding-memories photos:", err);
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
