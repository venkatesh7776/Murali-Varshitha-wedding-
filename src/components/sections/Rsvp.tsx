import { generated } from "@/lib/assets";
import { wedding } from "@/config/wedding";
import { rsvpCeremony } from "@/lib/wedding-data";
import { Reveal } from "../motion/Reveal";

export function Rsvp() {
  if (!wedding.rsvp.enabled) return null;
  // A background-free reception setup, falling back to the kalash ornament.
  const art = generated("rsvp-reception");
  const kalash = generated("ornament-kalash");

  return (
    <section id="rsvp" className="section bg-blush">
      <div className="container-wide max-w-2xl">
        <Reveal className="text-center">
          {art ? (
            // eslint-disable-next-line @next/next/no-img-element -- decorative illustration
            <img src={art} alt="" className="mx-auto mb-8 h-auto w-[min(26rem,85vw)] object-contain" loading="lazy" />
          ) : (
            kalash && (
              // eslint-disable-next-line @next/next/no-img-element -- small decorative ornament
              <img src={kalash} alt="" className="mx-auto mb-6 h-24 w-24 object-contain drop-shadow-[0_6px_10px_rgba(72,20,31,0.15)]" loading="lazy" />
            )
          )}
          <h2 className="t-h2 text-balance">Please Join Us for the Reception</h2>
          <p className="t-lead mx-auto mt-4 max-w-[44ch] text-ink-muted">
            We would love to celebrate this special evening with you and your family.
          </p>
          {rsvpCeremony && (
            <p className="t-label mt-6 text-[11px] leading-loose text-gold">
              {rsvpCeremony.dateLabel} · {rsvpCeremony.timeLabel}
              <span className="block normal-case tracking-normal">
                <span className="font-display text-lg italic text-maroon">{rsvpCeremony.venue.name}</span>
              </span>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
