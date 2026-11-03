import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { coupleNames } from "@/lib/wedding-data";
import { listMemoryFolders, memoriesConfigured } from "@/lib/memories";
import { MemoriesHeader } from "@/components/memories/MemoriesHeader";
import { FolderGrid } from "@/components/memories/FolderGrid";
import { GallerySkeleton } from "@/components/memories/GallerySkeleton";
import { Unavailable } from "@/components/memories/Unavailable";

export const metadata: Metadata = {
  title: `Wedding Memories · ${coupleNames}`,
  description: "Relive the beautiful moments of our celebration, captured through the eyes of our loved ones.",
};

async function Folders() {
  await connection(); // always live — folders come from the QR app
  if (!memoriesConfigured()) return <Unavailable reason="not_configured" />;
  const folders = await listMemoryFolders().catch((err) => {
    console.error("wedding-memories:", err);
    return null;
  });
  return folders ? <FolderGrid initial={folders} /> : <Unavailable reason="error" />;
}

export default function WeddingMemoriesPage() {
  return (
    <main className="min-h-[100svh] bg-ivory">
      <MemoriesHeader eyebrow="Every moment, a memory" title="Wedding Memories" back={{ href: "/#memories", label: "Back to invitation" }} />
      <section className="section !pt-[clamp(4.5rem,3.5rem+4vw,7rem)]">
        <div className="container-wide">
          <Suspense fallback={<GallerySkeleton variant="folders" />}>
            <Folders />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
