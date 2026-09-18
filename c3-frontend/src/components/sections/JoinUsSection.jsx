import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Sparkles, CheckCircle2, Code2, Users, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import BlurText from '../reactbits/BlurText';
import Terminal from '../reactbits/Terminal';

const VALUE_PILLARS = [
  { icon: BookOpen, text: 'Daily 15-Min Peer Presentations' },
  { icon: Code2, text: 'Hands-on Projects & Hackathons' },
  { icon: Users, text: 'Direct Senior Mentorship' },
  { icon: CheckCircle2, text: 'Placement & Aptitude Preparation' },
];

const QUICK_PERKS = [
  { label: 'Club Membership', value: '100% Free' },
  { label: 'Technical Domains', value: '5 Tracks' },
  { label: 'Skill Building', value: 'Live Peer Labs' },
  { label: 'Career Focus', value: 'Placement Prep' }
];

export const JoinUsSection = () => {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, amount: 0.2 });

  return (
    <section id="join" className="relative w-full bg-black overflow-hidden py-20 sm:py-28 lg:py-32">
      {/* Pure CSS ambient atmosphere - 0% CPU/GPU overhead */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#060B12] to-black pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title Header */}
        <div ref={introRef} className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-nav font-medium text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Recruitment Open 2026
          </span>

          {introInView && (
            <BlurText
              text="Join Campus to Corporate Club"
              direction="top"
              delay={40}
              stepDuration={0.35}
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4"
            />
          )}

          <p className="text-sm sm:text-base md:text-lg text-[#A1A1AA] leading-relaxed max-w-2xl mx-auto px-2">
            Every member started exactly where you are now — curious, ready to learn, and looking to build. Pick a domain, show up, and grow with people who will actually teach you.
          </p>
        </div>

        {/* Main CTA Card Box */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-xl p-5 sm:p-10 lg:p-14 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
          {/* Subtle top light edge */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#38BDF8]/50 to-transparent" />

          {/* Quick Perks Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-12">
            {QUICK_PERKS.map((perk, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center"
              >
                <div className="font-display text-sm sm:text-lg font-bold text-[#38BDF8]">{perk.value}</div>
                <div className="text-[10px] sm:text-xs text-[#71717A] mt-0.5">{perk.label}</div>
              </div>
            ))}
          </div>

          {/* 2-Column interactive grid: Terminal + Action Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Terminal simulator */}
            <div className="lg:col-span-6 w-full min-w-0">
              <Terminal />
            </div>

            {/* Right: Value Pillars & Direct CTA */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left min-w-0">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-4">
                What You Get as a C3 Member
              </h3>

              {/* Value Pillars List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
                {VALUE_PILLARS.map((pillar, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] shrink-0">
                      <pillar.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-white/90 leading-snug">
                      {pillar.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-3 w-full">
                <Link
                  to="/apply"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-black bg-white hover:bg-white/90 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Reassurance text */}
              <p className="text-xs text-[#71717A] max-w-sm mt-1">
                Applications reviewed on a rolling basis • No prior experience required
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;