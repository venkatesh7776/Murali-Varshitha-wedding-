"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BEGIN_EVENT } from "./sections/IntroReveal";

/** Dispatched by voice-note players so the music softens while a guest's voice plays. */
export const VOICE_EVENT = "wedding:voice";

type Props = { musicSrc: string; musicTitle: string };

/**
 * Music control (mute/unmute). Music starts when the guest taps "Explore Our Wedding"
 * (a real gesture, so browsers allow it); the dock shows from then on, or once the hero is scrolled past.
 * Other pages (the memories albums) show the dock straight away and start the music on the guest's
 * first tap — unless they muted it.
 */
export function FloatingDock({ musicSrc, musicTitle }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [begun, setBegun] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [note, setNote] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const mutedByGuest = useRef(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onBegin = () => {
      setBegun(true);
      // play() must be called synchronously inside the click that dispatched the event
      void startMusic();
    };
    window.addEventListener(BEGIN_EVENT, onBegin);
    return () => window.removeEventListener(BEGIN_EVENT, onBegin);
  });

  // Away from the invitation there's no "Explore" button, so begin on the first tap anywhere.
  useEffect(() => {
    if (onHome || playing || mutedByGuest.current) return;
    const first = (e: Event) => {
      // the dock's own button handles itself
      if ((e.target as Element | null)?.closest?.("[data-music-toggle]")) return;
      void startMusic();
    };
    window.addEventListener("pointerdown", first, { once: true });
    window.addEventListener("keydown", first, { once: true });
    return () => {
      window.removeEventListener("pointerdown", first);
      window.removeEventListener("keydown", first);
    };
  });

  // Soften the music while a guest's voice note plays.
  useEffect(() => {
    const onVoice = (e: Event) => {
      const el = audio.current;
      if (el) el.volume = (e as CustomEvent<boolean>).detail ? 0.06 : 0.45;
    };
    window.addEventListener(VOICE_EVENT, onVoice);
    return () => window.removeEventListener(VOICE_EVENT, onVoice);
  }, []);

  const visible = begun || scrolled || !onHome;

  async function startMusic() {
    const el = audio.current;
    if (!el) return;
    try {
      el.volume = 0.45;
      await el.play();
      setPlaying(true);
      setNote("");
    } catch {
      setPlaying(false);
    }
  }

  async function toggleMusic() {
    const el = audio.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      mutedByGuest.current = true;
      return;
    }
    mutedByGuest.current = false;
    await startMusic();
    if (el.paused) setNote("Music couldn't start on this browser.");
  }

  const btn =
    "flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-burgundy/90 text-gold-muted shadow-[0_8px_24px_-8px_rgba(48,39,35,0.5)] backdrop-blur transition-colors duration-300 hover:bg-maroon hover:text-ivory";

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 transition-all duration-500 sm:bottom-6 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {note && (
        <p role="status" className="rounded-sm bg-burgundy/90 px-3 py-2 text-xs text-ivory">
          {note}
        </p>
      )}
      {musicSrc && (
        <>
          <audio ref={audio} src={musicSrc} loop preload="metadata" onEnded={() => setPlaying(false)} />
          <button type="button" data-music-toggle onClick={toggleMusic} aria-pressed={playing} aria-label={playing ? `Mute ${musicTitle || "music"}` : `Unmute ${musicTitle || "music"}`} className={btn} tabIndex={visible ? 0 : -1}>
            {/* speaker with sound waves while playing, crossed out when muted */}
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" fillOpacity={0.15} />
              {playing ? (
                <>
                  <path d="M15.5 9.2a4 4 0 0 1 0 5.6" className="animate-pulse" />
                  <path d="M18 6.8a7.5 7.5 0 0 1 0 10.4" className="animate-pulse [animation-delay:300ms]" />
                </>
              ) : (
                <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
              )}
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
