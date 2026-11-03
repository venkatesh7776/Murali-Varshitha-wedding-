import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { coupleNames } from "@/lib/wedding-data";
import { getMemoryFolder, listMemoryPhotos, memoriesConfigured } from "@/lib/memories";
import { AlbumBar } from "@/components/memories/AlbumBar";
import { PhotoGallery } from "@/components/memories/PhotoGallery";
import { GallerySkeleton } from "@/components/memories/GallerySkeleton";
import { Unavailable } from "@/components/memories/Unavailable";

export const metadata: Metadata = { title: `Wedding Memories · ${coupleNames}` };

async function Album({ params }: { params: Promise<{ folderId: string }> }) {
  await connection();
  const { folderId } = await params;
  if (!memoriesConfigured()) {
    return (
      <>
        <AlbumBar title="Album" />
        <section className="section !pt-10">
          <Unavailable reason="not_configured" />
        </section>
      </>
    );
  }
  let folder: Awaited<ReturnType<typeof getMemoryFolder>>;
  let photos: Awaited<ReturnType<typeof listMemoryPhotos>> = [];
  try {
    folder = await getMemoryFolder(folderId);
    if (folder) photos = await listMemoryPhotos(folder.id);
  } catch (err) {
    console.error("wedding-memories album:", err);
    return (
      <>
        <AlbumBar title="Album" />
        <section className="section !pt-10">
          <Unavailable reason="error" />
        </section>
      </>
    );
  }
  if (!folder) notFound();

  return (
    <>
      <AlbumBar title={folder.name} />
      <section className="section !pt-8">
        <div className="container-wide">
          <PhotoGallery folderId={folder.id} initial={photos} />
        </div>
      </section>
    </>
  );
}

export default function AlbumPage({ params }: PageProps<"/wedding-memories/[folderId]">) {
  return (
    <main className="min-h-[100svh] bg-ivory">
      <Suspense
        fallback={
          <>
            <AlbumBar title="Opening album…" />
            <section className="section !pt-8">
              <div className="container-wide">
                <GallerySkeleton variant="photos" />
              </div>
            </section>
          </>
        }
      >
        <Album params={params} />
      </Suspense>
    </main>
  );
}
