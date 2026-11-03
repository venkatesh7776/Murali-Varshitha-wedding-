"use client";

import { useEffect, useRef, useState } from "react";
import { VOICE_EVENT } from "../FloatingDock";

const fmt = (s: number) => (Number.isFinite(s) && s > 0 ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

/** A guest's voice note, in the invitation's style. Softens the background music while it plays. */
export function VoiceNote({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  const signal = (on: boolean) => window.dispatchEvent(new CustomEvent(VOICE_EVENT, { detail: on }));
  useEffect(
    () => () => {
      signal(false);
    },
    [],
  );

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setFailed(true));
    else el.pause();
  };

  const progress = duration ? Math.min(100, (time / duration) * 100) : 0;

  return (
    <div className="flex items-center gap-3 rounded-full border border-gold/35 bg-white/5 py-2 pl-2 pr-4">
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onPlay={() => (setPlaying(true), signal(true))}
        onPause={() => (setPlaying(false), signal(false))}
        onEnded={() => (setPlaying(false), setTime(0), signal(false))}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        // webm voice notes report Infinity until fully read; fall back to what we've played
        onLoadedMetadata={(e) => setDuration(Number.isFinite(e.currentTarget.duration) ? e.currentTarget.duration : 0)}
        onDurationChange={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
        onError={() => setFailed(true)}
      />
      <button
        type="button"
        onClick={toggle}
        disabled={failed}
        aria-label={playing ? "Pause voice note" : "Play voice note"}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-burgundy transition-transform hover:scale-105 disabled:opacity-50"
      >
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
          {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M5 3l8 5-8 5z" />}
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <div className="h-1 overflow-hidden rounded-full bg-ivory/15">
          <div className="h-full rounded-full bg-gold transition-[width] duration-200" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1.5 text-[11px] tabular-nums text-ivory/60">
          {failed ? "Voice note unavailable" : duration ? `${fmt(time)} / ${fmt(duration)}` : playing ? fmt(time) : "Voice note"}
        </p>
      </div>
    </div>
  );
}
