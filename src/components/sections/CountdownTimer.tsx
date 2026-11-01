"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };
type State = { phase: "before"; parts: Parts } | { phase: "during" } | { phase: "after" };

function compute(target: number, end: number): State {
  const now = Date.now();
  if (now >= end) return { phase: "after" };
  if (now >= target) return { phase: "during" };
  const s = Math.floor((target - now) / 1000);
  return {
    phase: "before",
    parts: { days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, minutes: Math.floor(s / 60) % 60, seconds: s % 60 },
  };
}

const units: [keyof Parts, string][] = [
  ["days", "Days"],
  ["hours", "Hours"],
  ["minutes", "Minutes"],
  ["seconds", "Seconds"],
];

export function CountdownTimer({ targetIso, endIso }: { targetIso: string; endIso: string }) {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const target = Date.parse(targetIso);
    const end = Date.parse(endIso);
    const tick = () => setState(compute(target, end));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso, endIso]);

  if (state?.phase === "during") {
    return <p className="t-lead text-2xl text-gold-muted">Today is the day! Let the celebrations begin.</p>;
  }
  if (state?.phase === "after") {
    return <p className="t-lead text-2xl text-gold-muted">Thank you for celebrating with us.</p>;
  }

  return (
    <div role="timer" aria-live="off" className="grid grid-cols-4 divide-x divide-gold/30">
      {units.map(([key, label]) => {
        const value = state ? String(state.parts[key]).padStart(2, "0") : "––";
        return (
          <div key={key} className="flex flex-col items-center px-2 sm:px-8">
            <span className="h-[1.1em] overflow-hidden font-display text-[clamp(2.5rem,1.6rem+4.5vw,5rem)] font-light leading-none text-ivory [font-variant-numeric:lining-nums_tabular-nums]">
              <span key={value} className={state ? "digit-in" : ""}>
                {value}
              </span>
            </span>
            <span className="t-label mt-3 text-[10px] text-gold-muted sm:text-xs">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
