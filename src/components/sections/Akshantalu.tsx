"use client";

import { useRef, useState } from "react";

const COLORS = ["#F3E3B5", "#E9C46A", "#FAF5EC", "#E8D4CF", "#D99A3A"];

type Particle = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; color: string; petal: boolean };

/** Guest-triggered shower of akshata rice and petals — the page's one playful moment. */
export function Akshantalu() {
  const [blessed, setBlessed] = useState(false);
  const running = useRef(false);

  function shower() {
    setBlessed(true);
    if (running.current) return;
    // Guests asked for this shower, so it still plays with reduced motion — just fewer, slower and shorter.
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    running.current = true;

    const canvas = document.createElement("canvas");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = innerWidth;
    const h = innerHeight;
    Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "70" });
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const count = Math.round((w < 640 ? 70 : 130) * (calm ? 0.4 : 1));
    const speed = calm ? 0.55 : 1;
    const duration = calm ? 2600 : 3600;
    const particles: Particle[] = Array.from({ length: count }, () => {
      const petal = Math.random() < 0.35;
      return {
        x: Math.random() * w,
        // start across the top of the screen so the first grains are visible immediately
        y: -10 - Math.random() * h * 0.35,
        vx: (Math.random() - 0.5) * 0.6 * speed,
        vy: (1.6 + Math.random() * 2.2) * speed,
        r: petal ? 6 + Math.random() * 4 : 2.6 + Math.random() * 1.6,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.08,
        color: petal ? COLORS[3 + Math.floor(Math.random() * 2)] : COLORS[Math.floor(Math.random() * 3)],
        petal,
      };
    });

    const start = performance.now();
    const frame = (t: number) => {
      const elapsed = t - start;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = Math.min(1, Math.max(0, (duration - elapsed) / 600));
      for (const p of particles) {
        p.vy += 0.025 * speed;
        p.x += p.vx + Math.sin((elapsed + p.rot * 400) / 500) * (p.petal ? 0.6 : 0.2);
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.shadowColor = "rgba(0,0,0,0.35)";
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.petal ? p.r * 0.55 : p.r * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      if (elapsed < duration) requestAnimationFrame(frame);
      else {
        canvas.remove();
        running.current = false;
      }
    };
    requestAnimationFrame(frame);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button type="button" onClick={shower} className="btn btn--gold">
        Shower blessings
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
          <path d="M8 0l1.6 6.4L16 8l-6.4 1.6L8 16l-1.6-6.4L0 8l6.4-1.6z" />
        </svg>
      </button>
      <p aria-live="polite" className="min-h-6 text-sm text-ivory/70">
        {blessed ? "Your blessings have reached the couple." : "Tap to bless the couple with sacred rice and petals."}
      </p>
    </div>
  );
}
