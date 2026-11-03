"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Keeps server-rendered data fresh: re-fetches `url` every `intervalMs` while the tab is
 * visible, and immediately when the guest returns to it. New folders and photos uploaded
 * through the QR app appear without a page refresh.
 */
export function useLiveData<T>(url: string, initial: T, pick: (json: unknown) => T | undefined, intervalMs = 15_000) {
  const [data, setData] = useState(initial);
  const pickRef = useRef(pick);
  useEffect(() => {
    pickRef.current = pick;
  });

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return;
        const next = pickRef.current(await res.json());
        if (!stopped && next) setData(next);
      } catch {
        /* offline or a blip — keep what we have and try again next tick */
      }
    };
    const loop = () => {
      timer = setTimeout(async () => {
        await load();
        if (!stopped) loop();
      }, intervalMs);
    };
    const onVisible = () => document.visibilityState === "visible" && load();
    loop();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [url, intervalMs]);

  return data;
}
