import { wedding } from "@/config/wedding";
import { generated } from "@/lib/assets";
import { weddingDateLabel } from "@/lib/wedding-data";
import { Mandap } from "../art/Mandap";
import { Toranam } from "../art/Toranam";
import { ArchEdge, KolamTexture } from "../art/Ornaments";
import { Reveal } from "../motion/Reveal";
import { Akshantalu } from "./Akshantalu";

export function Blessings() {
  const { closing, bride, groom, invocation } = wedding;
  const desktop = generated("closing-mandap-desktop");
  const mobile = generated("closing-mandap-mobile");

  return (
    <section
      id="blessings"
      className="section section--dark relative isolate overflow-x-clip !pb-0 !pt-[clamp(8rem,6rem+8vw,12rem)]"
      // Ends on the painted mandap's own maroon so the artwork melts into the section.
      style={desktop ? { background: "linear-gradient(180deg, var(--burgundy) 0%, #5c1520 45%, #64161e 100%)" } : undefined}
    >
      <ArchEdge color="var(--burgundy)" flip />
      <KolamTexture className="-z-20 opacity-[0.06]" id="kolam-blessings" />
      {!desktop && <Toranam className="absolute inset-x-0 top-0 h-[64px] w-full sm:h-[96px]" />}

      <div className="container-wide relative text-center">
        <Reveal>
          <p className="font-display text-lg italic tracking-wide text-gold-muted">{invocation}</p>
          <p className="t-lead mx-auto mt-8 max-w-[52ch] text-balance text-[clamp(1.25rem,1.1rem+0.8vw,1.75rem)] text-ivory/90">
            {closing.message.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          {closing.blessing && <p className="t-deva mx-auto mt-6 max-w-[40ch] text-gold-muted">{closing.blessing}</p>}
        </Reveal>

        <Reveal delay={200} className="mt-12">
          <p className="t-names !text-[clamp(2rem,1.4rem+3vw,3.75rem)]">
            <span className="whitespace-nowrap">{groom.name}</span> <span className="font-display italic text-gold">&amp;</span>{" "}
            <span className="whitespace-nowrap">{bride.name}</span>
          </p>
          <p className="t-label mt-6 text-gold-muted">{weddingDateLabel}</p>
          {closing.families && <p className="mt-6 text-sm text-ivory/70">{closing.families}</p>}
        </Reveal>

        <Reveal delay={300} className="mt-12">
          <Akshantalu />
        </Reveal>

        {closing.contacts.length > 0 && (
          <Reveal delay={350} className="mt-12">
            <ul className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm">
              {closing.contacts.map((c) => (
                <li key={c.phone}>
                  <span className="t-label mr-2 text-[10px] text-gold">{c.label}</span>
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="text-ivory/85 hover:text-gold">
                    {c.phone}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {wedding.music.src && wedding.music.credit && (
          <p className="mt-10 text-[11px] text-ivory/45">{wedding.music.credit}</p>
        )}
      </div>

      {desktop ? (
        <Reveal className="relative -z-10 -mx-[var(--gutter)] -mt-10 md:-mt-[12vw]">
          <picture>
            {mobile && <source media="(orientation: portrait)" srcSet={mobile} />}
            <img
              src={desktop}
              alt="A wedding mandap lit by diyas around the sacred fire"
              loading="lazy"
              className="block aspect-[16/9] w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent,black_38%)] portrait:aspect-[941/900]"
            />
          </picture>
        </Reveal>
      ) : (
        <Reveal className="mx-auto mt-12 max-w-4xl">
          <Mandap className="h-auto w-full" />
        </Reveal>
      )}
    </section>
  );
}
