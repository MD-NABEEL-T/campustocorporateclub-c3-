import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { HoverBorderGradient } from '../ui/HoverBorderGradient';
import TextType from '../texttype';
import LineReveal from '../LineReveal';

export const HeroSection = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-4xl mx-auto min-h-[calc(100vh-5rem)] flex flex-col justify-center">
      {/* Title - line-by-line slide reveal, staggered diagonal at every breakpoint
          (small "tab space" indent on mobile, bold cascade from md+) */}
      <h1 className="leading-[1.05] text-left">
        <LineReveal
          active={ready}
          baseDelay={0.1}
          staggerDelay={0.18}
          lines={[
            <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white">
              Campus
            </span>,
            <span className="font-brand block text-3xl sm:text-5xl md:text-6xl text-white ml-8 sm:ml-24 md:ml-36 lg:ml-48">
              to
            </span>,
            <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white ml-14 sm:ml-40 md:ml-60 lg:ml-72">
              Corporate
            </span>
          ]}
        />
      </h1>

      {/* Everything below - centered, fades in after the heading finishes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center text-center mt-10 max-w-2xl mx-auto"
      >
        <div className="font-display text-base sm:text-lg text-[#A1A1AA] flex flex-wrap items-center justify-center gap-1 mb-10">
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

        <span className="block text-2xl sm:text-1xl md:text-xl font-normal text-white tracking-wide mt-0 mb-8">
          LEARN, COLLABORATE, GROW, LEAD
        </span>

        <div className="flex flex-wrap justify-center items-center gap-4">
          <HoverBorderGradient
            as={Link}
            to="/apply"
            containerClassName="rounded-full p-[2px] bg-white/10 hover:bg-white/5"
            className="font-medium bg-white text-black flex items-center gap-2 px-6 py-3.5 text-base"
          >
            Join C3
          </HoverBorderGradient>

          <HoverBorderGradient
            as={Link}
            to="/#team"
            containerClassName="rounded-full p-[2px]"
            className="font-medium bg-black text-white flex items-center gap-2 px-6 py-3.5 text-base"
          >
            Meet the Team <ArrowRight className="w-4 h-4" />
          </HoverBorderGradient>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;