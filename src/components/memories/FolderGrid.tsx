"use client";

import Link from "next/link";
import type { MemoryFolder } from "@/lib/memories";
import { KolamTexture, Mandala } from "../art/Ornaments";
import { FadeImage } from "./FadeImage";
import { useLiveData } from "./useLiveData";

const pickFolders = (j: unknown) => (j && typeof j === "object" && Array.isArray((j as { folders?: unknown }).folders) ? (j as { folders: MemoryFolder[] }).folders : undefined);

const photoLabel = (n: number) => (n === 0 ? "No photos yet" : `${n} ${n === 1 ? "photo" : "photos"}`);

function formatEventDate(date?: string) {
  if (!date) return undefined;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(y, m - 1, d));
}

/** A woven gold zari border: twin rules with a row of diamonds and dots between them. */
function ZariBand({ id, className }: { id: string; className: string }) {
  return (
    <svg aria-hidden className={`absolute inset-x-0 h-[14px] w-full ${className}`} preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="18" height="14" patternUnits="userSpaceOnUse">
          <path d="M9 2.5 13 7l-4 4.5L5 7z" fill="none" stroke="#C5A15B" strokeWidth="0.9" />
          <circle cx="9" cy="7" r="1" fill="#C5A15B" />
          <circle cx="0" cy="7" r="1.1" fill="#C5A15B" />
          <circle cx="18" cy="7" r="1.1" fill="#C5A15B" />
        </pattern>
      </defs>
      <rect width="100%" height="1" y="0.5" fill="#C5A15B" opacity="0.85" />
      <rect width="100%" height="14" fill={`url(#${id})`} opacity="0.8" />
      <rect width="100%" height="1" y="12.5" fill="#C5A15B" opacity="0.85" />
    </svg>
  );
}

/** A paper print peeking out of the folder. */
function Print({ src, alt, className }: { src?: string; alt: string; className: string }) {
  return (
    <span className={`absolute block bg-ivory p-[3%] shadow-[0_10px_22px_-10px_rgba(0,0,0,0.55)] transition-transform duration-500 ease-[var(--ease-silk)] ${className}`}>
      {src ? (
        <FadeImage src={src} alt={alt} wrapperClassName="h-full w-full" className="h-full w-full object-cover" />
      ) : (
        <span className="grid h-full w-full place-items-center bg-gradient-to-b from-ivory to-ivory-deep">
          <svg aria-hidden viewBox="0 0 48 48" className="h-8 w-8 text-gold/70" fill="none" stroke="currentColor" strokeWidth={1.2}>
            <path d="M6 16a3 3 0 0 1 3-3h5l3-4h14l3 4h5a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
            <circle cx="24" cy="25" r="7" />
          </svg>
        </span>
      )}
    </span>
  );
}

function FolderCard({ f }: { f: MemoryFolder }) {
  const date = formatEventDate(f.date);
  const [latest, previous] = f.previewUrls;

  return (
    <Link
      href={`/wedding-memories/${f.id}`}
      aria-label={`${f.name}, ${photoLabel(f.photoCount)}${date ? `, ${date}` : ""}`}
      className="group relative block aspect-[5/4.4] w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-gold"
    >
      {/* back panel + tab: warm sand, with the faintest kolam */}
      <span aria-hidden className="absolute left-0 top-0 h-[16%] w-[44%] overflow-hidden rounded-t-[12px] bg-[#dcc8a3]" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 top-[10%] overflow-hidden rounded-[12px] rounded-tl-none bg-[linear-gradient(165deg,#dcc8a3,#cdb68c)] shadow-[0_18px_36px_-24px_rgba(72,20,31,0.45)]">
        <KolamTexture className="opacity-[0.22]" id={`kolam-back-${f.id}`} />
      </span>

      {/* the latest photos, tucked inside */}
      <span aria-hidden className="absolute inset-x-[9%] top-[15%] h-[50%]">
        {previous && <Print src={previous} alt="" className="inset-y-0 left-[18%] right-0 rotate-[5deg] group-hover:-translate-y-[10%] group-hover:rotate-[8deg]" />}
        <Print src={latest} alt="" className="inset-y-0 left-0 right-[14%] -rotate-[2.5deg] group-hover:-translate-y-[16%] group-hover:-rotate-[4deg]" />
      </span>

      {/* front pocket: light beige paper, one fine zari line and a whisper of mandala */}
      <span className="absolute inset-x-0 bottom-0 h-[60%] overflow-hidden rounded-[12px] border border-[#d9c49d] bg-[linear-gradient(180deg,#f7efe0,#efe3cb)] shadow-[0_-8px_18px_-12px_rgba(72,20,31,0.3)] transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-y-[2%]">
        <ZariBand id={`zari-top-${f.id}`} className="top-[9%] opacity-55" />
        <Mandala className="pointer-events-none absolute -bottom-[40%] -right-[20%] w-[64%] text-maroon opacity-[0.05] transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:rotate-[20deg]" />
        <span className="absolute inset-x-[9%] bottom-[12%] text-left sm:pr-10">
          <span className="line-clamp-2 block font-display text-[clamp(1.05rem,0.95rem+0.6vw,1.45rem)] leading-[1.1] text-maroon">{f.name}</span>
          <span className="t-label mt-1.5 block text-[8px] leading-relaxed text-[#9a7535] sm:text-[9px]">
            {photoLabel(f.photoCount)}
            {date && <span className="text-ink-muted"> · {date}</span>}
          </span>
        </span>
        <span aria-hidden className="absolute bottom-[14%] right-[8%] hidden h-8 w-8 sm:grid place-items-center rounded-full border border-maroon/30 text-maroon transition-colors duration-300 group-hover:border-maroon group-hover:bg-maroon group-hover:text-ivory">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.4}>
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </span>
    </Link>
  );
}

/** Event folders created in the QR app, refreshed live. */
export function FolderGrid({ initial }: { initial: MemoryFolder[] }) {
  const all = useLiveData("/api/wedding-memories", initial, pickFolders);
  // Folders are created in the QR app before the events; show one only once guests have added photos.
  const folders = all.filter((f) => f.photoCount > 0);

  if (!folders.length) {
    return (
      <div role="status" className="mx-auto max-w-md rounded-sm border border-gold/35 bg-ivory/70 px-6 py-14 text-center">
        <svg aria-hidden viewBox="0 0 48 40" className="mx-auto h-11 w-14 text-gold" fill="none" stroke="currentColor" strokeWidth={1.2}>
          <path d="M3 8a3 3 0 0 1 3-3h11l4 4h21a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
        </svg>
        <p className="mt-5 font-display text-2xl text-maroon">Your photos will appear here</p>
        <p className="mt-3 text-ink-muted">
          Scan the QR code at any of our wedding events and upload the photos you take. Once they&apos;re shared, you&apos;ll find them here in an album for each event.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 justify-start gap-x-4 gap-y-8 sm:grid-cols-[repeat(auto-fill,minmax(15rem,17.5rem))] sm:gap-x-8 sm:gap-y-10">
      {folders.map((f, i) => (
        <li key={f.id} className="fade-in" style={{ animationDelay: `${Math.min(i, 6) * 90}ms` }}>
          <FolderCard f={f} />
        </li>
      ))}
    </ul>
  );
}
