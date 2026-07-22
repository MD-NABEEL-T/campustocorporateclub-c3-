import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

const HeroContent = ({ refs }) => {
  const { headingRef, subRef, descRef, ctaRef } = refs;

  return (
    <section
      id="home"
      className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-28 max-w-5xl mx-auto"
    >
      {/* Top Status Pill */}
      <div className="mb-6">
        <Badge variant="accent" icon={<Sparkles className="w-3.5 h-3.5" />}>
          Official CSE Technical Club • Junior Recruitment Open
        </Badge>
      </div>

      {/* Main Title */}
      <div className="relative inline-block mb-4">
        <h1
          ref={headingRef}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading text-[#F8FAFC] tracking-tight leading-[1.1]"
        >
          Campus to <span className="bg-gradient-to-r from-[#38BDF8] to-[#2DD4BF] bg-clip-text text-transparent">Corporate</span>
        </h1>
      </div>

      {/* Subheading */}
      <h2
        ref={subRef}
        className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] max-w-3xl mb-6 leading-snug"
      >
        Building Placement-Ready Engineers, One Session at a Time.
      </h2>

      {/* Description */}
      <p
        ref={descRef}
        className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mb-10 leading-relaxed font-sans"
      >
        C3 is the student-led technical club inside college running daily 15-minute presentation sessions, collaborative projects, and peer mentorship to bridge the gap between campus learning and corporate engineering expectations.
      </p>

      {/* CTAs */}
      <div ref={ctaRef} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Link to="/apply" className="w-full sm:w-auto">
          <Button
            variant="accent"
            size="lg"
            className="w-full sm:w-auto shadow-xl shadow-[#2DD4BF]/10"
            leftIcon={<Sparkles className="w-5 h-5" />}
          >
            Apply for Junior Batch
          </Button>
        </Link>

        <Link to="/sessions-archive" className="w-full sm:w-auto">
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Session Archive
          </Button>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="mt-16 pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#38BDF8]" /> Peer-Led Training
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#2DD4BF]" /> Daily 15-Min Presentations
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#22C55E]" /> Hands-on Project Execution
        </div>
      </div>
    </section>
  );
};

export default HeroContent;
