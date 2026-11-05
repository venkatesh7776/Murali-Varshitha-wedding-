import type { Credit } from "@/config/wedding";
import { wedding } from "@/config/wedding";
import { LotusDivider } from "../art/Ornaments";
import { Reveal } from "../motion/Reveal";

function Icon({ name }: { name: Credit["icon"] }) {
  return name === "camera" ? (
    <svg aria-hidden viewBox="0 0 32 32" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.3}>
      <path d="M4 11.5A2.5 2.5 0 0 1 6.5 9h3.2l2-3h8.6l2 3h3.2A2.5 2.5 0 0 1 28 11.5v12a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 23.5z" />
      <circle cx="16" cy="17" r="5" />
      <circle cx="16" cy="17" r="2" />
    </svg>
  ) : (
    <svg aria-hidden viewBox="0 0 32 32" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.3}>
      <path d="M16 5c3 4 3 10 0 15-3-5-3-11 0-15Z" />
      <path d="M16 20c-5-1-8.5-4.5-9.5-9 4.5.8 8 4 9.5 9Zm0 0c5-1 8.5-4.5 9.5-9-4.5.8-8 4-9.5 9Z" />
      <path d="M6 24c3 1.6 6.5 2.4 10 2.4S23 25.6 26 24" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Thanks the event organiser and photographer — the people behind the day. */
export function Credits() {
  const { credits } = wedding;
  if (!credits.items.length) return null;
  return (
    <section id="credits" className="section">
      <div className="container-wide max-w-4xl">
        <Reveal className="text-center">
          <p className="t-label text-gold">With gratitude</p>
          <h2 className="t-h2 mt-4">{credits.heading}</h2>
          <LotusDivider className="mt-6" />
          {credits.intro && <p className="t-lead mx-auto mt-6 max-w-[46ch] text-ink-muted">{credits.intro}</p>}
        </Reveal>

        <div className={`mt-14 grid gap-6 sm:gap-8 ${credits.items.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-md"}`}>
          {credits.items.map((c, i) => (
            <Reveal key={c.role} delay={i * 120} className="h-full">
              <article className="relative flex h-full flex-col items-center rounded-sm border border-gold/35 bg-ivory-deep/40 px-6 pb-9 pt-10 text-center">
                <span aria-hidden className="pointer-events-none absolute inset-2 rounded-[1px] border border-gold/15" />
                <span className="grid h-14 w-14 place-items-center rounded-full border border-gold/50 bg-ivory text-maroon">
                  <Icon name={c.icon} />
                </span>
                <p className="t-label mt-6 text-gold">{c.role}</p>
                <h3 className={`mt-3 font-display text-[clamp(1.6rem,1.4rem+0.8vw,2rem)] leading-tight ${c.placeholder ? "italic text-ink-muted" : "text-maroon"}`}>
                  {c.name}
                </h3>
                {c.description && <p className="mx-auto mt-3 max-w-[30ch] text-[0.95rem] leading-relaxed text-ink-muted">{c.description}</p>}
                {c.link && (
                  <a
                    href={c.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-gold/60 text-sm font-medium text-maroon transition-colors duration-300 hover:border-maroon"
                  >
                    <InstagramIcon />
                    {c.link.label}
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
