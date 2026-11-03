import { Intro } from "@/components/sections/Intro";
import { Hero } from "@/components/sections/Hero";
import { Couple } from "@/components/sections/Couple";
import { Countdown } from "@/components/sections/Countdown";
import { Ceremonies } from "@/components/sections/Ceremonies";
import { Venue } from "@/components/sections/Venue";
import { Gallery } from "@/components/sections/Gallery";
import { Rsvp } from "@/components/sections/Rsvp";
import { Blessings } from "@/components/sections/Blessings";
import { Credits } from "@/components/sections/Credits";
import { Memories } from "@/components/sections/Memories";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { TapBlessings } from "@/components/motion/TapBlessings";

export default function Invitation() {
  return (
    <>
      <ScrollProgress />
      <TapBlessings />
      <main>
        {/* The intro cover lifts off the pinned hero; then the couple section slides up over it */}
        <div className="relative">
          <Intro />
          <Hero />
          <div id="intro-spacer" aria-hidden className="h-[100svh]" />
          <Couple />
        </div>
        <Countdown />
        <Ceremonies />
        <Venue />
        <Gallery />
        <Rsvp />
        <Memories />
        <Credits />
        <Blessings />
      </main>
    </>
  );
}
