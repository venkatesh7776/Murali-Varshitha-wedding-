import type { CSSProperties } from "react";
import { wedding } from "@/config/wedding";
import { IntroReveal } from "./IntroReveal";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Full-screen cover that sits over the pinned hero. It stays in normal flow
 * (negative bottom margin), so the CTA lifts it away by scrolling; IntroReveal then
 * removes it for good so scrolling back up never brings it back.
 */
export function Intro() {
  return (
    <section
      id="intro"
      aria-label="Invitation cover"
      className="relative z-20 -mb-[100svh] flex h-[100svh] items-center justify-center overflow-hidden bg-ivory px-[var(--gutter)] text-center text-burgundy shadow-[0_24px_60px_-24px_rgba(48,39,35,0.45)]"
    >
      {/* phones get their own portrait painting of the same archway */}
      <picture className="hero-photo-in absolute inset-0 -z-10 block">
        <source media="(orientation: portrait)" srcSet="/images/intro/temple-arch-portrait.webp" />
        <img src="/images/intro/temple-arch.webp" alt="" className="h-full w-full object-cover object-center" fetchPriority="high" />
      </picture>
      {/* soft ivory light behind the type, only where the text sits */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_42%_at_50%_50%,color-mix(in_oklab,var(--ivory)_55%,transparent),transparent_75%)] portrait:bg-[radial-gradient(ellipse_75%_34%_at_50%_52%,color-mix(in_oklab,var(--ivory)_82%,transparent),transparent_80%)]"
      />

      <div className="flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- small decorative icon */}
        <img
          src="/images/intro/ganesha.webp"
          alt="Lord Ganesha"
          width={320}
          height={417}
          className="hero-in mb-3 h-16 w-auto drop-shadow-[0_6px_10px_rgba(72,20,31,0.18)] sm:h-20"
          style={delay(150)}
          fetchPriority="high"
        />
        <p className="hero-in font-display text-base italic tracking-wide text-[#9A7535] sm:text-lg" style={delay(300)}>
          {wedding.invocation}
        </p>

        <p className="t-names mt-5 text-maroon sm:mt-7">
          <span className="hero-in block" style={delay(500)}>
            {wedding.groom.name}
          </span>
          <span className="hero-in my-1 block font-display italic leading-none text-[#A9823A] sm:my-2" style={{ ...delay(650), fontSize: "0.62em" }}>
            &amp;
          </span>
          <span className="hero-in block" style={delay(800)}>
            {wedding.bride.name}
          </span>
        </p>

        <div className="hero-in mt-10 portrait:mt-8 sm:mt-12" style={delay(1150)}>
          <IntroReveal />
        </div>
      </div>
    </section>
  );
}
