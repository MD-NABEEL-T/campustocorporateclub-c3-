import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import TextType from '../ui/TextType';

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 sm:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto min-h-screen min-h-[100dvh] flex flex-col justify-center pt-28 pb-20 sm:pb-24">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left - main content (constrained so it never collides with photo on right) */}
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-7 max-w-2xl">
          {/* Eyebrow */}
          <span className="inline-flex w-fit items-center gap-2 font-nav text-[11px] sm:text-xs tracking-[0.22em] uppercase text-white/70 border border-white/15 rounded-full pl-2.5 pr-3.5 py-1.5 bg-white/[0.04] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_2px_rgba(56,189,248,0.6)]" />
            A Student-Led Community
          </span>

          {/* Title */}
          <h1 className="leading-[0.96] text-left border-l-2 border-white/20 pl-4 sm:pl-6">
            <span className="font-display block text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white">
              Campus
            </span>
            <span className="font-brand block text-3xl sm:text-5xl lg:text-6xl text-white/75 my-1 sm:my-2 ml-4 sm:ml-6 font-light italic">
              to
            </span>
            <span className="font-display block text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white ml-6 sm:ml-12">
              Corporate
            </span>
          </h1>

          {/* Subtitle + buttons */}
          <div className="flex flex-col items-start gap-6 pl-4 sm:pl-6">
            <div className="font-display text-base sm:text-xl text-white/90 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>The club where students</span>
              <TextType
                as="span"
                text={['Learn', 'Collaborate', 'Build', 'Grow']}
                typingSpeed={90}
                deletingSpeed={45}
                pauseDuration={1400}
                showCursor
                cursorCharacter="_"
                className="text-[#38BDF8] font-semibold font-nav"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link to="/apply" className="font-nav font-semibold bg-white text-black rounded-full px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_18px_rgba(56,189,248,0.35)] hover:shadow-[0_0_24px_rgba(56,189,248,0.6)] hover:scale-[1.02] active:scale-[0.98]">
                Join C3
              </Link>
              <Link to="/#team" className="font-nav font-semibold border border-white/35 text-white rounded-full px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base tracking-wide flex items-center gap-2 hover:border-white/75 hover:bg-white/10 transition-all backdrop-blur-sm">
                Meet the Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right - credibility anchor, desktop only */}
        <div className="lg:col-span-5 hidden lg:flex flex-col items-end justify-end h-full pb-6">
          <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 max-w-[15rem] text-right">
            <div className="w-8 h-0.5 bg-gradient-to-l from-[#38BDF8] to-transparent ml-auto mb-2" />
            <p className="font-nav text-xs text-white/70 tracking-wide leading-relaxed">
              The official CSE department club at CAHCET
            </p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 pointer-events-none">
        <span className="font-nav text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

    </section>
  );
};

export default HeroSection;