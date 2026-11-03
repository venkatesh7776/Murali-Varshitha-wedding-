/** Placeholder while live data streams in. */
export function GallerySkeleton({ variant }: { variant: "folders" | "photos" }) {
  if (variant === "folders") {
    return (
      <div aria-hidden className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mx-auto w-full max-w-[19rem] px-4 pt-4">
            <div className="arch memory-shimmer aspect-[4/5] border border-gold/30" />
            <div className="memory-shimmer mx-auto mt-7 h-8 w-2/3 rounded-sm" />
            <div className="memory-shimmer mx-auto mt-3 h-3 w-1/3 rounded-sm" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div aria-hidden className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
      {[220, 300, 260, 340, 240, 280, 320, 230].map((h, i) => (
        <div key={i} className="memory-shimmer mb-3 break-inside-avoid rounded-sm sm:mb-4" style={{ height: h }} />
      ))}
    </div>
  );
}
