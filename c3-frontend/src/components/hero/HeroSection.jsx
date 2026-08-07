import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TextType from '../texttype';

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-6 max-w-4xl mx-auto min-h-screen min-h-[100dvh] flex flex-col">

      {/* Title - top */}
      <div className="pt-20 sm:pt-0 sm:flex-1 sm:flex sm:flex-col sm:justify-center">
        <h1 className="leading-[1.05] text-left mb-8 sm:mb-10">
<h1 className="leading-[1.05] text-left mb-8 sm:mb-10 inline-block">
  <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white">
    Campus
  </span>

  <span className="font-brand block text-3xl sm:text-6xl md:text-6xl text-white translate-x-[5.8rem] sm:translate-x-16 md:translate-x-32">
    to
  </span>

  <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white translate-x-[3.5rem] sm:translate-x-20 md:translate-x-40">
    Corporate
  </span>
</h1>

        </h1>

        {/* Desktop subtitle + buttons */}
        <div className="hidden sm:flex flex-col gap-8">
          <div className="font-display text-lg text-[#A1A1AA] flex items-center gap-1">
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
            <Link to="/apply" className="font-nav font-semibold bg-white text-black rounded-full px-7 py-3 text-base tracking-wide hover:bg-white/90 transition-colors">
              Join C3
            </Link>
            <Link to="/#team" className="font-nav font-semibold border border-white/40 text-white rounded-full px-7 py-3 text-base tracking-wide flex items-center gap-2 hover:border-white/80 hover:bg-white/5 transition-all">
              Meet the Team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile - subtitle + buttons, lifted from bottom */}
      <div className="sm:hidden pb-16 flex flex-col items-center gap-4">
        <div className="font-display text-sm text-[#A1A1AA] flex items-center gap-1">
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
        <div className="flex items-center justify-center gap-3">
          <Link to="/apply" className="font-nav font-semibold bg-white text-black rounded-full px-6 py-2.5 text-sm tracking-wide hover:bg-white/90 transition-colors">
            Join C3
          </Link>
          <Link to="/#team" className="font-nav font-semibold border border-white/40 text-white rounded-full px-6 py-2.5 text-sm tracking-wide flex items-center gap-2 hover:border-white/80 hover:bg-white/5 transition-all">
            Meet the Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;