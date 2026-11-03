import { listMemoryFolders, memoriesConfigured } from "@/lib/memories";

/** Folder list for live refresh on /wedding-memories. Read-only. */
export async function GET() {
  if (!memoriesConfigured()) return Response.json({ error: "not_configured" }, { status: 503 });
  try {
    return Response.json({ folders: await listMemoryFolders() }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("wedding-memories folders:", err);
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
