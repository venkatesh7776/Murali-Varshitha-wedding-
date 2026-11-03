import Link from "next/link";

/** Slim top of an album: back to all albums and the folder name. */
export function AlbumBar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-gold/25 bg-ivory/90 px-[var(--gutter)] backdrop-blur-md">
      <div className="container-wide flex min-h-16 items-center gap-3 py-2 sm:min-h-20">
        <Link
          href="/wedding-memories"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-gold/50 px-4 text-sm font-medium text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-ivory"
        >
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          <span className="sm:hidden">Albums</span>
          <span className="hidden sm:inline">All Albums</span>
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.5rem)] leading-tight text-maroon">{title}</h1>
        </div>
        {/* balances the back button so the title stays centred */}
        <span aria-hidden className="w-[5.5rem] shrink-0 sm:w-[8.5rem]" />
      </div>
    </header>
  );
}
