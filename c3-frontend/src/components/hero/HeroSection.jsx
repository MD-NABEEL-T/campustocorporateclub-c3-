import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HoverBorderGradient } from '../ui/HoverBorderGradient';
import TextType from '../texttype';
// import CountUp from '../CountUp'; // stats hidden for now, reserved for a later page

// const STATS = [
//   { to: 20, suffix: '+', label: 'Members' },
//   { to: 30, suffix: '+', label: 'Sessions' },
//   { to: 10, suffix: '+', label: 'Events' },
// ];

export const HeroSection = () => {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 max-w-4xl mx-auto min-h-[calc(100vh-5rem)] flex flex-col justify-start">
      {/* Title - unchanged, staggered, left aligned */}
      <h1 className="leading-[1.05]">
        <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white">
          Campus
        </span>
        <span className="font-brand block text-3xl sm:text-5xl md:text-6xl text-white ml-10 sm:ml-16 md:ml-80">
          to
        </span>
        <span className="font-display block text-4xl sm:text-6xl md:text-7xl font-bold text-white ml-20 sm:ml-32 md:ml-100">
          Corporate
        </span>
      </h1>

      {/*
        Slogan banner - shifted right under the title, like a tagline.
        Swap the font class below to test each of the 5 locked fonts:
          font-display  -> Space Grotesk
          font-brand    -> Playfair Display Italic
          font-editorial-> EB Garamond
          font-nav      -> Rajdhani   (currently applied)
          (no class)    -> Manrope (default body font)
      */}

      {/* Everything below - centered */}
      <div className="flex flex-col items-center text-center mt-10 max-w-2xl mx-auto">
        {/* <TextType
          as="p"
          text={[
            'The Official Club of the CSE Department ',
            'Collaborate with Like Minded people and conduct events',
          ]}
          typingSpeed={35}
          deletingSpeed={20}
          pauseDuration={2000}
          showCursor
          cursorCharacter="_"
          className="font-editorial font-medium text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-6 block"
        /> */}

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
      <span className=" block text-2xl sm:text-1xl md:text-xl font-normal text-white tracking-wide mt-0 mb-8">
        LEARN, COLLABORATE, GROW, LEAD
      </span>
        {/* Buttons - centered, gradient border made thicker/more visible */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          <HoverBorderGradient
            as={Link}
            to="/apply"
            containerClassName="rounded-full p-[2px] bg-white/10 hover:bg-white/5"
            className="font-medium bg-white text-black flex items-center gap-2 px-6 py-3.5 text-base"
          >
            Join C3
          </HoverBorderGradient>

          {/* TODO: point to /team once a real Team page/route exists */}
          <HoverBorderGradient
            as={Link}
            to="/about"
            containerClassName="rounded-full p-[2px]"
            className="font-medium bg-black text-white flex items-center gap-2 px-6 py-3.5 text-base"
          >
            Meet the Team <ArrowRight className="w-4 h-4" />
          </HoverBorderGradient>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;