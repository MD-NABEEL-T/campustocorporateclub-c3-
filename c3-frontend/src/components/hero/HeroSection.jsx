import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import TextType from '../ui/TextType';

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto min-h-screen min-h-[100dvh] flex flex-col justify-center pt-24 sm:pt-28 pb-16 sm:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column - Main Brand & Value Proposition */}
        <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 max-w-2xl">
          {/* Eyebrow Badge */}
          <div className="inline-flex w-fit items-center gap-2 font-nav text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/80 border border-white/15 rounded-full px-3.5 py-1.5 bg-white/[0.04] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_10px_2px_rgba(56,189,248,0.7)] animate-pulse" />
            <span>A Student-Led Community • CAHCET CSE</span>
          </div>

          {/* Clean, Majestic Heading */}
          <h1 className="font-display font-extrabold tracking-tight text-white leading-[1.04] text-left">
            <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
              Campus
            </span>
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="font-brand font-light italic text-2xl sm:text-4xl lg:text-5xl text-white/70">
                to
              </span>
              <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-white via-[#F0F9FF] to-[#38BDF8] bg-clip-text text-transparent">
                Corporate
              </span>
              <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#38BDF8]">
                Club
              </span>
            </div>
          </h1>

          {/* Subtitle with dynamic text typing */}
          <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg lg:text-xl text-white/90">
            <span>The club where students</span>
            <TextType
              as="span"
              text={['Learn by Teaching', 'Build Real Projects', 'Master Tech Skills', 'Grow as Leaders']}
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              className="text-[#38BDF8] font-semibold font-nav"
            />
          </div>

          {/* Brief Department Description */}
          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-xl">
            Official Computer Science and Engineering department club at CAHCET. Bridging the gap between academic learning and industry readiness through collaborative sessions, peer mentorship, and project building.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              to="/apply"
              className="font-nav font-semibold bg-white text-black rounded-full px-7 py-3 text-sm sm:text-base tracking-wide hover:bg-white/90 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Join C3
            </Link>
            <a
              href="#about"
              className="font-nav font-semibold border border-white/20 text-white rounded-full px-6 py-3 text-sm sm:text-base tracking-wide flex items-center gap-2 hover:border-white/50 hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              About Club <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#team"
              className="font-nav font-medium text-xs sm:text-sm text-[#A1A1AA] hover:text-white px-3 py-2 transition-colors"
            >
              Meet Team →
            </a>
          </div>
        </div>

        {/* Right Column - Spacer for unobstructed photo on desktop */}
        <div className="lg:col-span-5 hidden lg:block" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 pointer-events-none">
        <span className="font-nav text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;