import { generated } from "@/lib/assets";
import { wedding } from "@/config/wedding";
import { rsvpCeremony } from "@/lib/wedding-data";
import { Reveal } from "../motion/Reveal";
import { RsvpDialog } from "./RsvpDialog";

export function Rsvp() {
  const { rsvp } = wedding;
  if (!rsvp.enabled) return null;
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
          <p className="t-label text-gold">RSVP{rsvpCeremony && ` · ${rsvpCeremony.name}`}</p>
          <h2 className="t-h2 mt-4">Will You Join Us?</h2>
          <p className="t-lead mx-auto mt-4 max-w-[44ch] text-ink-muted">
            We would love to celebrate this special evening with you. Kindly let us know if you&apos;ll be joining us.
          </p>
        </Reveal>
        <Reveal delay={150} className="mt-10 flex justify-center">
          <RsvpDialog
            title={rsvpCeremony ? `${rsvpCeremony.name} · ${rsvpCeremony.dateLabel}` : "Will You Join Us?"}
            collectGuestCount={rsvp.collectGuestCount}
            maxGuests={rsvp.maxGuests}
          />
        </Reveal>
      </div>
    </section>
  );
}
