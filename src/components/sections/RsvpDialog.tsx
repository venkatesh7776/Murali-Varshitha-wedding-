"use client";

import { useEffect, useRef, useState } from "react";
import { RsvpForm } from "./RsvpForm";

/** A single "Submit RSVP" button; the reply form opens in a modal dialog. */
export function RsvpDialog({ title, collectGuestCount, maxGuests }: { title: string; collectGuestCount: boolean; maxGuests: number }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  // Remount the form each time so a fresh reply starts clean.
  const [round, setRound] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setRound((r) => r + 1);
          setOpen(true);
        }}
        className="btn btn--maroon min-w-56"
      >
        Submit RSVP
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        aria-labelledby="rsvp-dialog-title"
        className="m-auto max-h-[92svh] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto rounded-sm border border-gold/40 bg-ivory p-0 text-ink shadow-[0_30px_80px_-20px_rgba(48,20,25,0.6)] backdrop:bg-burgundy/70 backdrop:backdrop-blur-[2px]"
      >
        <div className="relative p-6 sm:p-10">
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-11 w-11 place-items-center text-maroon/70 transition-colors hover:text-maroon"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.4}>
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
          <p className="t-label text-center text-gold">RSVP</p>
          <h3 id="rsvp-dialog-title" className="t-h3 mt-3 text-center">
            {title}
          </h3>
          <div className="mt-8">{open && <RsvpForm key={round} collectGuestCount={collectGuestCount} maxGuests={maxGuests} />}</div>
        </div>
      </dialog>
    </>
  );
}
