import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import TextType from '../ui/TextType';

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 sm:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto min-h-screen min-h-[100dvh] flex flex-col justify-center pt-24 pb-20 sm:pb-24">

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end">
        {/* Left - main content */}
        <div className="flex flex-col gap-6 sm:gap-8 max-w-3xl">
          {/* Eyebrow */}
          <span className="inline-flex w-fit items-center gap-2 font-nav text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/60 border border-white/15 rounded-full pl-2.5 pr-3.5 py-1.5 bg-white/[0.03]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_2px_rgba(56,189,248,0.6)]" />
            A Student-Led Community
          </span>

          {/* Title */}
          <h1 className="leading-[0.98] text-left border-l-2 border-white/15 pl-5 sm:pl-7">
            <span className="font-display block text-[13vw] sm:text-7xl md:text-8xl font-bold text-white">
              Campus
            </span>
            <span className="font-brand block text-[7vw] sm:text-5xl md:text-6xl text-white/70 my-1 sm:my-2 ml-[3vw] sm:ml-8">
              to
            </span>
            <span className="font-display block text-[13vw] sm:text-7xl md:text-8xl font-bold text-white ml-[4vw] sm:ml-16 md:ml-24">
              Corporate
            </span>
          </h1>

          {/* Subtitle + buttons */}
          <div className="flex flex-col items-start gap-6 pl-5 sm:pl-7">
            <div className="font-display text-base sm:text-xl text-white/90 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>The club where students</span>
              <TextType
                as="span"
                text={['Learn', 'Collaborate', 'Build', 'Grow']}
                typingSpeed={90}
                deletingSpeed={45}
                pauseDuration={1400}
                showCursor
                cursorCharacter="_"
                className="text-white font-semibold font-nav"
              />
            </div>
            <div className="flex items-center gap-3">
              <Link to="/apply" className="font-nav font-semibold bg-white text-black rounded-full px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base tracking-wide hover:bg-white/90 transition-colors">
                Join C3
              </Link>
              <Link to="/#team" className="font-nav font-semibold border border-white/40 text-white rounded-full px-6 py-2.5 sm:px-7 sm:py-3 text-sm sm:text-base tracking-wide flex items-center gap-2 hover:border-white/80 hover:bg-white/5 transition-all">
                Meet the Team <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right - credibility anchor, desktop only. Balances the empty right
            column at wide viewports with real (not fabricated) context instead
            of stretching the left column or leaving dead space. */}
        <div className="hidden lg:flex flex-col items-end gap-3 pb-2 text-right">
          <div className="w-10 h-px bg-gradient-to-l from-white/40 to-transparent" />
          <p className="font-nav text-sm text-white/50 tracking-wide leading-relaxed max-w-[14rem]">
            The official CSE department club at CAHCET
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
        <span className="font-nav text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

    </section>
  );
};

export default HeroSection;