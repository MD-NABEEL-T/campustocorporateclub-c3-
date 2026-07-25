import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import RotatingText from '../RotatingText';
import CountUp from '../CountUp';

const STATS = [
  { to: 120, suffix: '+', label: 'Sessions Held' },
  { to: 8, suffix: '+', label: 'Events Conducted' },
  { to: 60, suffix: '+', label: 'Active Members' },
  { to: 5, suffix: '', label: 'Domains Covered' },
];

const HeroContent = ({ refs }) => {
  const { headingRef, subRef, descRef, ctaRef } = refs;

  return (
    <section
      id="home"
      className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-24 max-w-4xl mx-auto"
    >
      {/* Brand heading - centered, dominant, the primary identity statement */}
      <h1
        ref={headingRef}
        className="font-heading text-white font-extrabold tracking-tight leading-[1.08] text-4xl sm:text-6xl md:text-7xl mb-5"
      >
        Campus to Corporate Club <span className="text-[#3B82F6]">(C3)</span>
      </h1>

      {/* Rotating text - supporting element only, small and secondary */}
      <h2
        ref={subRef}
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm sm:text-base font-sans text-[#A1A1AA] mb-6"
      >
        <span>Where students keep</span>
        <RotatingText
          texts={['Learning', 'Collaborating', 'Developing', 'Debugging', 'Hacking', 'Growing']}
          mainClassName="px-2 py-0.5 bg-white/[0.06] text-white border border-white/10 rounded-md overflow-hidden justify-center font-semibold"
          staggerFrom="last"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-120%' }}
          staggerDuration={0.02}
          splitLevelClassName="overflow-hidden"
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          rotationInterval={2200}
        />
      </h2>

      {/* C3-specific thesis statement */}
      <p
        ref={descRef}
        className="text-base sm:text-lg text-[#A1A1AA] max-w-2xl mb-10 leading-relaxed font-sans"
      >
        C3 is our college's own tech community — students running daily sessions, building real
        projects, and preparing each other for the corporate world, one day at a time.
      </p>

      {/* CTA hierarchy: primary (solid), secondary (outline, scrolls to About),
          tertiary (ghost, scrolls to Domains) */}
      <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Link to="/apply" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Join C3
          </Button>
        </Link>

        <a href="#why-c3" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Why Join Us
          </Button>
        </a>

        <a href="#domains" className="w-full sm:w-auto">
          <Button variant="ghost" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Domains
          </Button>
        </a>
      </div>

      {/* Stats - kept small and secondary, CountUp-driven */}
      <div className="mt-12 pt-5 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex items-center gap-1.5">
            <span className="font-mono text-base sm:text-lg font-semibold text-white tabular-nums">
              <CountUp to={stat.to} duration={2} />
              {stat.suffix}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroContent;