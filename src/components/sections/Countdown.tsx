import { celebrationsEndIso, weddingDate, weddingDateLabel } from "@/lib/wedding-data";
import { ArchEdge, KolamTexture } from "../art/Ornaments";
import { Reveal } from "../motion/Reveal";
import { CountdownTimer } from "./CountdownTimer";

export function Countdown() {
  return (
    <section id="countdown" className="section section--dark z-20 overflow-x-clip">
      <ArchEdge color="var(--burgundy)" flip />
      <KolamTexture className="opacity-[0.06]" id="kolam-countdown" />
      <div className="container-wide relative text-center">
        <Reveal>
          <p className="t-label text-gold">Counting down to the Muhurtham</p>
          <h2 className="t-h2 mt-4">{weddingDateLabel}</h2>
        </Reveal>
        {weddingDate && celebrationsEndIso && (
          <Reveal delay={150} className="mx-auto mt-14 max-w-3xl border-y border-gold/30 py-10">
            <CountdownTimer targetIso={weddingDate.toISOString()} endIso={celebrationsEndIso} />
          </Reveal>
        )}
      </div>
      <ArchEdge color="var(--burgundy)" />
    </section>
  );
}
