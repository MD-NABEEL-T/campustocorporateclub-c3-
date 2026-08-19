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
          <div className="absolute inset-0">
            {/* Full-bleed, unmasked - people should actually be visible.
                Object-position keeps heads clear of the headline zone
                (top-left on mobile, left column on desktop); the scrim
                below does the rest of the work so we don't have to lean on
                heavy grayscale/brightness filters to keep text readable. */}
            <picture>
              <source media="(max-width: 639px)" srcSet="/assets/c3fullmembers2.jpg" />
              <img
                src="/assets/c3fullmembers.jpg.jpeg"
                alt="C3 Club Members"
                className="absolute inset-0 w-full h-full object-cover object-[center_28%] sm:object-[68%_38%] [filter:grayscale(0.15)_contrast(1.05)_brightness(0.92)]"
              />
            </picture>

            {/* Directional scrim: dark where the headline sits, clearer
                where people should stay recognizable. Mobile stacks the
                heading over the top, so it's a vertical fade with a
                brighter band in the middle where faces are; desktop reads
                left-to-right (text column vs. image side), so it's a
                diagonal fade instead. */}
            <div
              className="absolute inset-0
                bg-[linear-gradient(to_bottom,black_0%,rgba(0,0,0,0.72)_16%,rgba(0,0,0,0.28)_40%,rgba(0,0,0,0.22)_58%,rgba(0,0,0,0.74)_84%,black_100%)]
                sm:bg-[linear-gradient(115deg,black_0%,rgba(0,0,0,0.8)_28%,rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.12)_72%,rgba(0,0,0,0.05)_100%)]"
            />

            {/* Premium detail 1/2: a slow, barely-there breathing glow
                behind the photo - reads as depth, not motion. Pure opacity
                tween, cheap on mobile. */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_75%_45%,rgba(56,189,248,0.16),transparent_65%)]"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
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