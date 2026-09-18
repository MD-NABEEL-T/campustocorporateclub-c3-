import { motion } from 'motion/react';
import HeroSection from '../../components/hero/HeroSection';
import AboutSection from '../../components/sections/AboutSection';
import DomainsSection from '../../components/sections/DomainsSection';
import TeamSection from '../../components/sections/TeamSection';
import EventsSection from '../../components/sections/EventsSection';
import JoinUsSection from '../../components/sections/JoinUsSection';

// Flip to compare the hero as pure oversized typography vs. with the team
// photo present. Nothing else about the composition changes either way.
const SHOW_HERO_PHOTO = true;

export const Home = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black">
      <section id="home" className="relative min-h-screen min-h-[100dvh]">
        {/* Base atmosphere - two soft brand-color glows, on regardless of
            the photo toggle so the page never reads as flat black. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050608] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_15%_25%,rgba(59,130,246,0.14),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_88%_80%,rgba(45,212,191,0.09),transparent_65%)]" />

        {SHOW_HERO_PHOTO && (
          <div className="absolute inset-0 overflow-hidden">
            {/* On desktop, image occupies right ~60% so left side is dedicated to high-contrast text.
                On mobile, object-position keeps members' faces framed cleanly. */}
            <picture>
              <source media="(max-width: 768px)" srcSet="/assets/c3fullmembers2.jpg" />
              <img
                src="/assets/c3fullmembers.jpg.jpeg"
                alt="C3 Club Members"
                fetchPriority="high"
                decoding="async"
                className="absolute right-0 inset-y-0 w-full lg:w-[62%] h-full object-cover object-[center_20%] lg:object-[center_35%] [filter:grayscale(0.08)_contrast(1.04)_brightness(0.95)]"
              />
            </picture>

            {/* Directional scrim: deep black on left where text lives, soft transparent blend toward right photo */}
            <div
              className="absolute inset-0
                bg-[linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.85)_25%,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.92)_85%,black_100%)]
                lg:bg-[linear-gradient(to_right,black_0%,black_38%,rgba(0,0,0,0.75)_52%,rgba(0,0,0,0.2)_72%,rgba(0,0,0,0.05)_100%)]"
            />
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