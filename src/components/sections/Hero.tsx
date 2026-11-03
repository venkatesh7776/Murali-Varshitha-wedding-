import type { CSSProperties } from "react";
import { wedding } from "@/config/wedding";
import { generated } from "@/lib/assets";
import { weddingDateLabel } from "@/lib/wedding-data";
import { Gopuram } from "../art/Gopuram";
import { Toranam } from "../art/Toranam";
import { Parallax } from "../motion/Parallax";
import { ScrollDim } from "../motion/ScrollDim";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/**
 * Two treatments share the same content:
 * - with painted artwork: a light, daylight scene with bold burgundy type set straight on the open sky.
 *   On portrait screens the art comes in two layers — the garlanded sky is there from the start and
 *   the gopuram rises from the bottom once the intro cover lifts.
 * - without: maroon dusk with the line-art gopuram rising beneath the names
 */
export function Hero() {
  const photoDesktop = generated("hero-gopuram-desktop");
  const photoMobile = generated("hero-gopuram-mobile");
  const skyMobile = generated("hero-sky-mobile");
  const templeMobile = generated("hero-temple-mobile");
  const layered = Boolean(skyMobile && templeMobile);
  const photo = Boolean(photoDesktop);

  return (
    <section
      id="top"
      className={`sticky top-0 isolate z-0 flex min-h-[100svh] flex-col overflow-x-clip ${photo ? "bg-ivory text-burgundy" : "bg-hero text-ivory"}`}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {photo ? (
          <>
            <div className="hero-photo-in absolute inset-0">
              <picture className="block h-full w-full">
                {layered ? (
                  <source media="(orientation: portrait)" srcSet={skyMobile} />
                ) : (
                  photoMobile && <source media="(orientation: portrait)" srcSet={photoMobile} />
                )}
                <img src={photoDesktop} alt="" className="h-full w-full object-cover object-top" fetchPriority="high" />
              </picture>
            </div>
            {layered && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden portrait:block">
                {/* full-width gopuram cutout that rises once the intro lifts; on short screens its marble floor tucks below the edge so the tower clears the names */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={templeMobile} alt="" className="temple-rise block h-auto w-full [@media(min-aspect-ratio:1/2)]:-mb-[16vw]" fetchPriority="high" />
              </div>
            )}
          </>
        ) : (
          <Toranam className="toranam-in absolute inset-x-0 top-0 h-[72px] w-full sm:h-[110px]" />
        )}
      </div>

      <Parallax
        speed={-0.25}
        fadeOver={0.6}
        className={`relative mx-auto flex w-full max-w-4xl flex-col items-center px-[var(--gutter)] text-center ${
          photo
            ? "pt-[max(5.5rem,11svh)] md:landscape:mr-0 md:landscape:w-[60%] md:landscape:pt-[max(9rem,22svh)]"
            : "pt-[max(6.5rem,15svh)] sm:pt-[max(8.5rem,16svh)]"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- small decorative icon */}
        <img
          src="/images/intro/ganesha.webp"
          alt="Lord Ganesha"
          width={320}
          height={417}
          className="hero-in mb-2 h-12 w-auto drop-shadow-[0_6px_10px_rgba(72,20,31,0.18)] sm:h-14 [@media(orientation:portrait)_and_(max-height:760px)]:hidden"
          style={delay(250)}
        />
        <p className={`hero-in font-display text-lg italic tracking-wide sm:text-xl ${photo ? "font-medium text-maroon" : "text-gold-muted"}`} style={delay(400)}>
          {wedding.invocation}
        </p>

        <h1 className={`t-names mt-6 sm:mt-8 ${photo ? "font-medium [text-shadow:0_2px_20px_rgba(72,20,31,0.14)]" : ""}`}>
          <span className="hero-in block text-balance" style={delay(600)}>
            {wedding.groom.name}
          </span>
          <span className="hero-in my-1 flex items-center justify-center gap-4 sm:my-2" style={delay(760)}>
            <svg aria-hidden viewBox="0 0 80 2" className="h-px w-10 sm:w-16">
              <line x1="0" y1="1" x2="80" y2="1" stroke="currentColor" pathLength={1} className="draw-line text-gold" style={delay(900)} />
            </svg>
            <span className={`font-display italic leading-none ${photo ? "text-[#94702F]" : "text-gold"}`} style={{ fontSize: "max(0.62em, 2.5rem)" }}>
              &amp;
            </span>
            <svg aria-hidden viewBox="0 0 80 2" className="h-px w-10 sm:w-16">
              <line x1="80" y1="1" x2="0" y2="1" stroke="currentColor" pathLength={1} className="draw-line text-gold" style={delay(900)} />
            </svg>
          </span>
          <span className="hero-in block text-balance" style={delay(880)}>
            {wedding.bride.name}
          </span>
        </h1>

        <p className={`hero-in t-lead mt-5 max-w-[46ch] sm:mt-6 ${layered ? "portrait:hidden" : ""} ${photo ? "text-ink" : "text-ivory/85"}`} style={delay(1040)}>
          <span className="block lg:whitespace-nowrap">Two hearts, one destiny, and a lifetime of togetherness.</span>
          <span className="mt-1 block text-[0.92em] opacity-85 lg:whitespace-nowrap">Together with our families, we joyfully invite you to celebrate our wedding.</span>
        </p>
        <p className={`hero-in t-label mt-4 ${layered ? "portrait:mt-3 [@media(orientation:portrait)_and_(max-height:760px)]:hidden" : ""} ${photo ? "text-maroon" : "text-gold"}`} style={delay(1160)}>
          {weddingDateLabel}
        </p>

      </Parallax>

      {!photo && (
        <div className="pointer-events-none relative mt-auto flex justify-center overflow-hidden pt-10">
          <Parallax speed={0.1} max={50}>
            <Gopuram className="hero-rise block h-[clamp(15rem,46svh,33rem)] w-auto max-w-none" />
          </Parallax>
        </div>
      )}

      <ScrollDim />
    </section>
  );
}
