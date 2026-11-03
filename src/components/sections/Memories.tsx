import Link from "next/link";
import { ArchEdge, KolamTexture } from "../art/Ornaments";
import { Reveal } from "../motion/Reveal";

/**
 * Guest snapshots (illustrative) as overlapping Polaroids. The side prints sit inside the
 * collage box (no clipping): each is 37% wide, shifted ±72% of its own width from centre.
 */
const snapshots = [
  { src: "/images/memories/guest-haldi.webp", caption: "Haldi", pos: "-translate-x-[72%] translate-y-[10%] -rotate-[7deg]" },
  { src: "/images/memories/guest-mehendi.webp", caption: "Mehendi", pos: "translate-x-[72%] translate-y-[12%] rotate-[7deg]" },
  { src: "/images/memories/guest-reception.webp", caption: "Reception", pos: "z-10 -translate-y-[6%] rotate-[1.5deg]" },
];

/** Homepage introduction to the guest photo albums (/wedding-memories). */
export function Memories() {
  return (
    <section id="memories" className="section section--dark z-20 overflow-x-clip">
      <ArchEdge color="var(--burgundy)" flip />
      <KolamTexture className="opacity-[0.06]" id="kolam-memories-home" />
      <div className="container-wide relative grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="relative mx-auto aspect-[10/8] w-full max-w-[30rem]">
          <div className="absolute inset-0 flex items-center justify-center">
            {snapshots.map((s) => (
              <figure
                key={s.src}
                className={`absolute w-[37%] rounded-[2px] bg-ivory p-[3%] pb-0 shadow-[0_22px_40px_-16px_rgba(0,0,0,0.6),0_2px_6px_rgba(0,0,0,0.25)] ${s.pos}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- decorative snapshot */}
                <img src={s.src} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
                <figcaption className="py-[9%] text-center font-display text-[clamp(0.85rem,0.75rem+0.4vw,1.05rem)] italic text-maroon">{s.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        <div className="text-center md:text-left">
          <Reveal>
            <p className="t-label text-gold">Capture. Share. Relive.</p>
            <h2 className="t-h2 mt-4 text-balance">Every Moment, A Memory</h2>
            <p className="t-lead mx-auto mt-5 max-w-[38ch] text-ivory/90 md:mx-0">
              Scan the QR codes placed at each wedding event and upload the beautiful moments you capture.
            </p>
            <p className="mx-auto mt-4 max-w-[44ch] text-[0.95rem] leading-relaxed text-ivory/65 md:mx-0">
              All your photos will be collected into event-wise albums on this website. Come back anytime to explore and relive those memories!
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-9">
            <Link href="/wedding-memories" className="btn btn--gold group">
              Explore Wedding Memories
              <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.4}>
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </div>
      <ArchEdge color="var(--burgundy)" />
    </section>
  );
}
