"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MemoryPhoto } from "@/lib/memories";
import { FadeImage } from "./FadeImage";
import { useLiveData } from "./useLiveData";
import { VoiceNote } from "./VoiceNote";

const pickPhotos = (j: unknown) => (j && typeof j === "object" && Array.isArray((j as { photos?: unknown }).photos) ? (j as { photos: MemoryPhoto[] }).photos : undefined);

const credit = (p: MemoryPhoto) => (p.source === "couple" ? "Shared by the couple" : p.guestName ? `Shared by ${p.guestName}` : "Shared by a guest");

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" })
    .format(new Date(iso))
    .replace(/\s?([ap])\.?m\.?/i, (_, x: string) => ` ${x.toLowerCase()}m`);

/** Small chips on a tile: a note, a voice note, and the reactions guests gave. */
function TileBadges({ p }: { p: MemoryPhoto }) {
  if (!p.message && !p.voiceUrl && !p.reactions.length) return null;
  const chip = "flex h-7 items-center gap-1 rounded-full bg-burgundy/75 px-2 text-[12px] text-ivory backdrop-blur-sm";
  return (
    <span className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1.5">
      {p.message && (
        <span className={chip} title="Has a note">
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.3}>
            <path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" />
          </svg>
        </span>
      )}
      {p.voiceUrl && (
        <span className={chip} title="Has a voice note">
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.3}>
            <rect x="6" y="2" width="4" height="8" rx="2" />
            <path d="M3.5 8a4.5 4.5 0 0 0 9 0M8 12.5V14" />
          </svg>
        </span>
      )}
      {p.reactions.length > 0 && (
        <span className={chip}>
          {p.reactions.slice(0, 3).map(([e]) => (
            <span key={e} className="leading-none">{e}</span>
          ))}
          <span className="ml-0.5 tabular-nums text-ivory/80">{p.reactions.reduce((n, [, c]) => n + c, 0)}</span>
        </span>
      )}
    </span>
  );
}

/** 2 / 3 / 4 columns by width, matching the old md/lg breakpoints. */
function useColumnCount() {
  const [n, setN] = useState(2);
  useEffect(() => {
    const md = matchMedia("(min-width: 768px)");
    const lg = matchMedia("(min-width: 1024px)");
    const update = () => setN(lg.matches ? 4 : md.matches ? 3 : 2);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return n;
}

/** Masonry gallery of one folder, refreshed live, with a full-screen viewer. */
export function PhotoGallery({ folderId, initial }: { folderId: string; initial: MemoryPhoto[] }) {
  const photos = useLiveData(`/api/wedding-memories/${folderId}`, initial, pickPhotos);
  const columnCount = useColumnCount();
  // Real height/width of each photo once it loads, so columns can be balanced.
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const noteRatio = useCallback(
    (id: string, r: number) => setRatios((prev) => (Math.abs((prev[id] ?? 0) - r) < 0.01 ? prev : { ...prev, [id]: r })),
    [],
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const index = openId ? photos.findIndex((p) => p.id === openId) : -1;

  // Masonry: each photo goes to the currently shortest column (newest first), so columns end
  // evenly; never more columns than photos, so even a small album spans the full width.
  const cols = Math.max(1, Math.min(columnCount, photos.length));
  const columns: { p: MemoryPhoto; i: number }[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  photos.forEach((p, i) => {
    const c = heights.indexOf(Math.min(...heights));
    columns[c].push({ p, i });
    heights[c] += (ratios[p.id] ?? 1.25) + 0.04; // + the gap between tiles
  });

  if (!photos.length) {
    return (
      <div role="status" className="mx-auto max-w-md rounded-sm border border-gold/35 bg-ivory/70 px-6 py-14 text-center">
        <svg aria-hidden viewBox="0 0 48 48" className="mx-auto h-12 w-12 text-gold" fill="none" stroke="currentColor" strokeWidth={1.1}>
          <path d="M6 16a3 3 0 0 1 3-3h5l3-4h14l3 4h5a3 3 0 0 1 3 3v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" />
          <circle cx="24" cy="25" r="7" />
        </svg>
        <p className="mt-5 font-display text-2xl text-maroon">No photos are available in this folder yet</p>
        <p className="mt-3 text-ink-muted">Photos will appear here as soon as guests share them.</p>
      </div>
    );
  }

  return (
    <>
      <p className="t-label mb-6 text-center text-[10px] text-gold" aria-live="polite">
        {photos.length} {photos.length === 1 ? "photo" : "photos"}
      </p>
      <div className="flex gap-3 sm:gap-4">
        {columns.map((column, c) => (
          <ul key={c} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
            {column.map(({ p, i }) => (
              <li key={p.id} className="fade-in" style={{ animationDelay: `${Math.min(i, 12) * 50}ms` }}>
                <button
                  type="button"
                  onClick={() => setOpenId(p.id)}
                  className="group relative block w-full overflow-hidden rounded-sm outline-none ring-1 ring-gold/25 focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label={`Open photo ${i + 1} of ${photos.length} — ${credit(p)}${p.message ? `: “${p.message}”` : ""}`}
                >
                  <FadeImage src={p.url} alt="" onRatio={(r) => noteRatio(p.id, r)} wrapperClassName="min-h-32" className="block h-auto w-full transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-[1.03]" />
                  <TileBadges p={p} />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-burgundy/85 via-burgundy/40 to-transparent px-3 pb-2.5 pt-10 text-left">
                    {p.message && <span className="line-clamp-2 font-display text-[15px] italic leading-snug text-ivory">“{p.message}”</span>}
                    <span className="mt-0.5 block text-[11px] text-ivory/80">{credit(p)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
      {index >= 0 && <Lightbox photos={photos} index={index} onIndex={(i) => setOpenId(photos[i]?.id ?? null)} onClose={() => setOpenId(null)} />}
    </>
  );
}

function Lightbox({ photos, index, onIndex, onClose }: { photos: MemoryPhoto[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const photo = photos[index];
  const go = useCallback((d: number) => onIndex((index + d + photos.length) % photos.length), [index, photos.length, onIndex]);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Warm the neighbours so swiping feels instant.
  useEffect(() => {
    for (const d of [1, -1]) {
      const n = photos[(index + d + photos.length) % photos.length];
      if (n) new Image().src = n.url;
    }
  }, [index, photos]);

  const navBtn = "grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-burgundy/70 text-ivory backdrop-blur transition-colors hover:border-gold hover:bg-burgundy";
  const hasDetails = Boolean(photo.message || photo.voiceUrl || photo.reactions.length);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label="Photo viewer"
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#1f0a0f] p-0 text-ivory backdrop:bg-black/60"
    >
      <div className="flex h-full flex-col lg:flex-row">
        <div
          className="relative flex min-h-0 flex-1 flex-col"
          onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
          onTouchEnd={(e) => {
            const s = touch.current;
            touch.current = null;
            if (!s) return;
            const dx = e.changedTouches[0].clientX - s.x;
            const dy = e.changedTouches[0].clientY - s.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) onClose();
          }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="t-label text-[10px] text-gold-muted">
              {index + 1} / {photos.length}
            </p>
            <button type="button" onClick={onClose} aria-label="Close viewer" className={navBtn}>
              <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-3 sm:px-20">
            {/* eslint-disable-next-line @next/next/no-img-element -- signed Storage URL */}
            <img key={photo.id} src={photo.url} alt={photo.message ?? credit(photo)} className="fade-in max-h-full max-w-full select-none object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]" />
            {photos.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={`${navBtn} absolute left-3 top-1/2 hidden -translate-y-1/2 sm:grid`}>
                  <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
                    <path d="M10 3L5 8l5 5" />
                  </svg>
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photo" className={`${navBtn} absolute right-3 top-1/2 hidden -translate-y-1/2 sm:grid`}>
                  <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* details: who shared it, their note, voice note and reactions */}
        <aside className="max-h-[42dvh] shrink-0 overflow-y-auto border-t border-gold/20 bg-[#2a0d14] px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 lg:max-h-none lg:w-[380px] lg:border-l lg:border-t-0 lg:pt-20">
          <p className="t-label text-[10px] text-gold">{credit(photo)}</p>
          <p className="mt-1 text-xs text-ivory/50">{when(photo.createdAt)}</p>

          {photo.message && <blockquote className="mt-5 font-display text-[1.55rem] italic leading-snug text-ivory">“{photo.message}”</blockquote>}

          {photo.voiceUrl && (
            <div className="mt-6">
              <p className="t-label mb-3 text-[10px] text-gold-muted">Voice note</p>
              <VoiceNote key={photo.id} src={photo.voiceUrl} />
            </div>
          )}

          {photo.reactions.length > 0 && (
            <div className="mt-6 border-t border-gold/15 pt-5">
              <p className="t-label mb-3 text-[10px] text-gold-muted">Reactions</p>
              <ul className="flex flex-wrap gap-2">
                {photo.reactions.map(([emoji, count]) => (
                  <li key={emoji} aria-label={`${emoji} ${count}`} className="flex h-9 items-center gap-1.5 rounded-full border border-gold/30 px-3 text-base">
                    <span>{emoji}</span>
                    <span className="text-xs tabular-nums text-ivory/70">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!hasDetails && <p className="mt-5 text-sm text-ivory/45">No note with this photo.</p>}
          {photos.length > 1 && <p className="mt-6 text-[11px] text-ivory/40 lg:hidden">Swipe the photo to browse · swipe down to close</p>}
        </aside>
      </div>
    </dialog>
  );
}
