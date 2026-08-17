import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import TextType from '../ui/TextType';

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 sm:px-8 lg:px-12 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto min-h-screen min-h-[100dvh] flex flex-col justify-center gap-6 sm:gap-8 lg:gap-10">

      {/* Eyebrow */}
      <span className="font-nav text-xs sm:text-sm tracking-[0.25em] uppercase text-white/50">
        A Student-Led Community
      </span>

      {/* Title */}
      <div>
        <h1 className="leading-[1.05] text-left">
          <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white">
            Campus
          </span>
          <span className="font-brand block text-3xl sm:text-5xl md:text-6xl text-white ml-[clamp(1rem,8vw,6rem)]">
            to
          </span>
          <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white ml-[clamp(0.5rem,15vw,12rem)]">
            Corporate
          </span>
        </h1>
      </div>

      {/* Subtitle + buttons */}
      <div className="flex flex-col items-start gap-5">
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

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
        <span className="font-nav text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>

    </section>
  );
};

export default HeroSection;