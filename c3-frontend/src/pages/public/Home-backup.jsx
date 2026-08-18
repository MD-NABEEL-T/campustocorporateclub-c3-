import { useRef } from 'react';
import HeroSection from '../../components/hero/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import DomainsSection from '../../components/sections/DomainsSection';
import TeamSection from '../../components/sections/TeamSection';
import EventsSection from '../../components/sections/EventsSection';
import JoinUsSection from '../../components/sections/JoinUsSection';
import AscentLine from '../../components/effects/AscentLine';

// Flip to compare the Ascent hero as pure oversized typography vs. with the
// team photo present as a soft atmospheric layer. Nothing else about the
// composition changes either way - flip it back and forth freely.
const SHOW_HERO_PHOTO = true;

export const Home = () => {
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className="relative w-full overflow-hidden bg-black">
      {/* Ascent spine - sits above every section (z-30) as a scroll-linked
          glow line. See AscentLine.jsx for why that's safe over both
          backgrounds and text. */}
      <AscentLine target={pageRef} />

      <section id="home" className="relative min-h-screen min-h-[100dvh]">
        {/* Base atmosphere - on regardless of the photo toggle, so the
            "no photo" variant is never a bare black rectangle. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050608] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_15%_25%,rgba(59,130,246,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_88%_80%,rgba(45,212,191,0.09),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px]" />

        {/* Optional photo atmosphere - masked into a soft, off-center glow
            behind the type (right side, away from the left-aligned title)
            rather than a full-bleed background. Grayscale + darkened +
            gradient-tinted so it reads as texture that belongs to this
            page, not a separate bright rectangle sitting on top of it. */}
        {SHOW_HERO_PHOTO && (
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_58%_72%_at_80%_42%,black,transparent_72%)] [-webkit-mask-image:radial-gradient(ellipse_58%_72%_at_80%_42%,black,transparent_72%)]">
            <picture>
              <source media="(max-width: 639px)" srcSet="/assets/c3fullmembers2.jpg" />
              <img
                src="/assets/c3fullmembers.jpg.jpeg"
                alt="C3 Club Members"
                className="absolute inset-0 w-full h-full object-cover object-[center_35%] scale-110 opacity-[0.6] [filter:grayscale(0.6)_contrast(1.1)_brightness(0.6)]"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/25 via-transparent to-[#2DD4BF]/15 mix-blend-color" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

        <HeroSection />
      </section>

      <AboutSection />

      {/* Rhythm break - a soft glow seam instead of a hard black-to-black cut. */}
      <div className="relative h-24 sm:h-32 -my-12 sm:-my-16 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(56,189,248,0.08),transparent_70%)]" />
      </div>

      <DomainsSection />
      <TeamSection />
      <EventsSection />
      <JoinUsSection />
    </div>
  );
};

export default Home;