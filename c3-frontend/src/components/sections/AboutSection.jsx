import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlurText from '../BlurText';
import CountUp from '../CountUp';
import ShapeGrid from '../ShapeGrid';

const ABOUT_PARAGRAPH =
  'Campus to Corporate Club (C3) is the official Computer Science and Engineering department club at CAHCET. We believe learning becomes more meaningful when students teach, collaborate, organize, and build together. Through technical sessions, workshops, events, and peer learning, members strengthen both their technical and professional skills while developing communication, leadership, teamwork, and confidence.';

const HIGHLIGHTS = [
  'Learn by Teaching',
  'Conduct Technical Sessions',
  'Organize Events',
  'Improve Communication',
  'Develop Leadership'
];

const STATS = [
  { to: 20, suffix: '+', label: 'Members' },
  { to: 30, suffix: '+', label: 'Sessions' },
  { to: 10, suffix: '+', label: 'Events' }
];

// Ready for more images later - just push new entries here.
const CAROUSEL_IMAGES = [{ src: '/assets/c3fullmembers.jpg.jpeg', alt: 'C3 full members' }];

const GlassCarousel = () => {
  const [index, setIndex] = useState(0);
  const hasMultiple = CAROUSEL_IMAGES.length > 1;

  const prev = () => setIndex(i => (i - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  const next = () => setIndex(i => (i + 1) % CAROUSEL_IMAGES.length);

  return (
    <div className="relative w-full max-w-md aspect-[4/5] mx-auto">
      <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <img
          src={CAROUSEL_IMAGES[index].src}
          alt={CAROUSEL_IMAGES[index].alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 pointer-events-none" />
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {CAROUSEL_IMAGES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const AboutSection = () => {
  return (
    <section id="about" className="relative w-full overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <ShapeGrid
          speed={0.4}
          squareSize={40}
          direction="diagonal"
          borderColor="#2F293A"
          hoverFillColor="#222"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left - content */}
        <div>
          <BlurText
            text="About Us"
            direction="top"
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          />

          <BlurText
            text={ABOUT_PARAGRAPH}
            direction="top"
            delay={6}
            stepDuration={0.25}
            className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8 max-w-xl"
          />

          <div className="flex flex-wrap gap-3 mb-12">
            {HIGHLIGHTS.map((pill, i) => (
              <BlurText
                key={pill}
                text={pill}
                direction="top"
                delay={40}
                animateBy="words"
                stepDuration={0.3}
                className="!inline-flex !flex-nowrap px-4 py-1.5 rounded-full text-sm font-medium text-white bg-white/5 border border-white/10 backdrop-blur-sm"
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-10">
            {STATS.map(stat => (
              <div key={stat.label}>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white flex items-baseline">
                  <CountUp to={stat.to} duration={2} />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-sm text-[#A1A1AA] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - glassmorphism carousel */}
        <GlassCarousel />
      </div>
    </section>
  );
};

export default AboutSection;