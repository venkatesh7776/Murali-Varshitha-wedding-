import Link from "next/link";
import { wedding } from "@/config/wedding";
import { ArchEdge, KolamTexture, LotusDivider } from "../art/Ornaments";

/** Burgundy banner shared by the memories pages, in the invitation's own style. */
export function MemoriesHeader({ eyebrow, title, back }: { eyebrow: string; title: string; back: { href: string; label: string } }) {
  return (
    <header className="section section--dark relative z-10 overflow-x-clip !pb-[clamp(4rem,3rem+4vw,6rem)] !pt-6">
      <KolamTexture className="opacity-[0.06]" id="kolam-memories" />
      <div className="container-wide relative">
        <Link
          href={back.href}
          className="t-label inline-flex min-h-11 items-center gap-2 text-[10px] text-gold-muted transition-colors hover:text-gold"
        >
          <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.4}>
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          {back.label}
        </Link>
        <div className="mt-8 text-center sm:mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element -- small decorative icon */}
          <img src="/images/intro/ganesha.webp" alt="" width={320} height={417} className="mx-auto mb-4 h-12 w-auto" />
          <p className="t-label text-gold">{eyebrow}</p>
          <h1 className="t-h2 mt-4 text-balance">{title}</h1>
          <p className="mt-4 font-display text-lg italic text-ivory/75">
            {wedding.groom.name} <span className="text-gold">&amp;</span> {wedding.bride.name}
          </p>
          <LotusDivider className="mt-6" />
        </div>
      </div>
      <ArchEdge color="var(--burgundy)" />
    </header>
  );
}
