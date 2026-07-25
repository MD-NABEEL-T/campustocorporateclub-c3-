import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HoverBorderGradient } from '../ui/HoverBorderGradient';
import { TextShimmer } from '../TextShimmer';
import { TextType } from '../texttype';
import CountUp from '../CountUp';

const STATS = [
  { to: 20, suffix: '+', label: 'Members' },
  { to: 30, suffix: '+', label: 'Sessions' },
  { to: 10, suffix: '+', label: 'Events' },
];

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 max-w-6xl mx-auto min-h-[calc(100vh-5rem)] flex flex-col justify-start">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-10">
        {/* LEFT - staggered title, Club, and the typewriter tagline */}
        <div className="text-left">
          <h1 className="leading-[1.05]">
            <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white">
              Campus
            </span>
            <span className="font-brand block text-3xl sm:text-5xl md:text-6xl text-white ml-10 sm:ml-16 md:ml-20">
              to
            </span>
            <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white ml-20 sm:ml-32 md:ml-40">
              Corporate
            </span>
          </h1>
          <span className="font-display block text-xl sm:text-2xl md:text-3xl text-[#A1A1AA] mt-3 mb-5">
            Club
          </span>

          <div className="font-editorial text-base sm:text-lg text-[#A1A1AA]">
            The club where students{' '}
            <TextType
              words={['Learn', 'Collaborate', 'Build', 'Grow']}
              className="inline-flex items-center"
              highlightClassName="text-white font-semibold font-nav"
            />
          </div>
        </div>

        {/* RIGHT - pushed down to align with the hero title, shimmer tagline
            above the description, stats now live here too */}
        <div className="text-left lg:pt-16">
          <TextShimmer className="font-nav text-xs uppercase tracking-[0.2em] mb-4 inline-block">
            Learn. Build. Collaborate. Lead.
          </TextShimmer>

          <p className="font-editorial font-medium text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8">
            The official CSE Department club at CAHCET, building placement-ready engineers through
            daily peer sessions and real project work.
          </p>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-start">
                <span className="font-nav text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  <CountUp to={stat.to} duration={2} />
                  {stat.suffix}
                </span>
                <span className="text-[10px] font-nav uppercase tracking-widest text-[#A1A1AA] mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons - both via HoverBorderGradient, primary inverted (white bg,
          black text), secondary in its default (black bg, white text) */}
      <div className="flex flex-wrap items-center gap-4">
        <HoverBorderGradient
          as={Link}
          to="/apply"
          containerClassName="rounded-full bg-white/10 hover:bg-white/5"
          className="font-nav bg-white text-black font-semibold flex items-center gap-2 px-6 py-3.5 text-base"
        >
          Join C3
        </HoverBorderGradient>

        {/* TODO: point to /team once a real Team page/route exists */}
        <HoverBorderGradient
          as={Link}
          to="/about"
          containerClassName="rounded-full"
          className="font-nav bg-black text-white flex items-center gap-2 px-6 py-3.5 text-base"
        >
          Meet the Team <ArrowRight className="w-4 h-4" />
        </HoverBorderGradient>
      </div>
    </section>
  );
};

export default HeroSection;