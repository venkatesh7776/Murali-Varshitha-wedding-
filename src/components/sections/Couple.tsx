import Image from "next/image";
import type { Person } from "@/config/wedding";
import { wedding } from "@/config/wedding";
import { asset } from "@/lib/assets";
import { LotusDivider, Mandala } from "../art/Ornaments";
import { Reveal } from "../motion/Reveal";

function Portrait({ person, role, delay, className = "" }: { person: Person; role: "Bride" | "Groom"; delay: number; className?: string }) {
  const photo = asset(person.photo);
  return (
    <article className={`flex flex-col items-center text-center ${className}`}>
      <div className="relative w-full max-w-[20rem] px-3 pt-3">
        {/* offset gold frame with a lotus at its apex */}
        <span aria-hidden className="arch pointer-events-none absolute inset-0 translate-x-2.5 translate-y-2.5 border border-gold/60" />
        <svg aria-hidden viewBox="0 0 48 24" className="absolute -top-3 left-1/2 z-10 h-6 w-12 -translate-x-1/2 text-gold">
          <path d="M24 2 C28 8 28 14 24 20 C20 14 20 8 24 2 Z" fill="var(--ivory)" stroke="currentColor" strokeWidth={1} />
          <path d="M24 20 C17 18 12 13 11 7 C17 9 21 13 24 20 Z M24 20 C31 18 36 13 37 7 C31 9 27 13 24 20 Z" fill="var(--ivory)" stroke="currentColor" strokeWidth={1} />
        </svg>
        <Reveal variant="image" delay={delay} className="arch relative aspect-[3/4] w-full bg-ivory-deep shadow-[0_30px_60px_-30px_rgba(72,20,31,0.45)]">
          {photo ? (
            <Image
              src={photo}
              alt={`Portrait of ${person.name}`}
              fill
              sizes="(min-width: 768px) 20rem, 85vw"
              className="object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-silk)] hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3">
              <span className="font-display text-7xl italic text-gold/70">{person.name.charAt(0)}</span>
              <span className="t-label text-[10px] text-ink-muted">{role}&apos;s portrait</span>
            </div>
          )}
        </Reveal>
      </div>

      <Reveal delay={delay + 150} className="mt-10">
        <p className="t-label text-gold">The {role.toLowerCase()}</p>
        <h3 className="mt-3 font-display text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none text-maroon">{person.name}</h3>
        {(person.invitationName || person.qualification) && (
          <p className="mt-3 font-display text-lg italic text-ink">
            {[person.invitationName, person.qualification].filter(Boolean).join(" · ")}
          </p>
        )}
        {person.parents && <p className="t-lead mt-3 text-[1.05rem] text-ink-muted">{person.parents}</p>}
        <span aria-hidden className="mx-auto mt-5 block h-px w-12 bg-gold/60" />
        {person.address && (
          <address className="mx-auto mt-5 max-w-[32ch] text-[0.95rem] not-italic leading-relaxed text-ink-muted">{person.address}</address>
        )}
        {person.intro && <p className="mx-auto mt-5 max-w-[32ch] text-[0.95rem] leading-relaxed text-ink-muted">{person.intro}</p>}
      </Reveal>
    </article>
  );
}

function Ampersand({ className = "" }: { className?: string }) {
  return (
    <Reveal delay={250} className={`flex flex-col items-center gap-4 ${className}`}>
      <span aria-hidden className="hidden h-24 w-px bg-gradient-to-b from-transparent to-gold/60 md:block" />
      <span className="font-display text-[5.5rem] italic leading-none text-gold md:text-[7rem]">&amp;</span>
      <span className="font-display text-base italic tracking-wide text-maroon">Shubha Vivaha</span>
      <span aria-hidden className="hidden h-24 w-px bg-gradient-to-t from-transparent to-gold/60 md:block" />
    </Reveal>
  );
}

export function Couple() {
  return (
    <section
      id="couple"
      className="section relative z-10 overflow-hidden rounded-t-[2rem] bg-ivory shadow-[0_-24px_60px_-24px_rgba(48,39,35,0.45)] sm:rounded-t-[3rem]"
    >
      <Mandala className="pointer-events-none absolute left-1/2 top-[38%] w-[min(1100px,160vw)] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.07]" />

      <div className="container-wide relative">
        <Reveal className="text-center">
          <p className="t-label text-gold">With joy, we introduce</p>
          <h2 className="t-h2 mt-4">{wedding.coupleHeading}</h2>
          <LotusDivider className="mt-6" />
          {wedding.coupleIntro && <p className="t-lead mx-auto mt-6 max-w-[46ch] text-ink-muted">{wedding.coupleIntro}</p>}
        </Reveal>

        <div className="mt-16 grid items-start gap-14 md:mt-20 md:grid-cols-[1fr_auto_1fr] md:gap-8 lg:gap-14">
          <Portrait person={wedding.groom} role="Groom" delay={0} />
          <Ampersand className="md:mt-16" />
          <Portrait person={wedding.bride} role="Bride" delay={150} />
        </div>
      </div>
    </section>
  );
}
