import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TextType from '../texttype';

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 max-w-4xl mx-auto min-h-screen min-h-[100dvh] flex flex-col justify-between">

      {/* Title — top */}
      <div className="pt-16 sm:pt-32">
        <h1 className="leading-[1.05] text-left">
          <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white">
            Campus
          </span>
          <span className="font-brand block text-3xl sm:text-5xl md:text-6xl text-white ml-[40%] sm:ml-16 md:ml-80">
            to
          </span>
          <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white ml-[50%] sm:ml-32 md:ml-100">
            Corporate
          </span>
        </h1>
      </div>

      {/* Subtitle + buttons — bottom */}
      <div className="pb-12 sm:pb-16 flex flex-col items-start gap-5">
        <div className="font-display text-sm sm:text-lg text-[#A1A1AA] flex items-center gap-1">
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

    </section>
  );
};

export default HeroSection;