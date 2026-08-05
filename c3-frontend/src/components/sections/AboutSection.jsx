import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlurText from '../BlurText';
// import CountUp from '../CountUp';
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

// const STATS = [
//   { to: 20, suffix: '+', label: 'Members' },
//   { to: 30, suffix: '+', label: 'Sessions' },
//   { to: 10, suffix: '+', label: 'Events' }
// ];

// Swap `src` here once the edited promo video is ready. `poster` is the
// placeholder shown until then (and as the video's poster frame).
const MEDIA_ITEMS = [
  { type: 'video', src: '', poster: '/assets/c3fullmembers.jpg.jpeg', alt: 'C3 full members' }
];

const slideVariants = {
  enter: direction => ({ x: direction > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: direction => ({ x: direction > 0 ? -48 : 48, opacity: 0 })
};

const MediaSlide = ({ item }) => {
  if (item.type === 'video' && item.src) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        poster={item.poster}
        src={item.src}
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }

  // Placeholder until the promo video is supplied.
  return (
    <>
      <img
        src={item.poster}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
      />
      <img
        src={item.poster}
        alt={item.alt}
        className="absolute inset-0 w-full h-full object-contain object-center"
      />
      <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-[11px] font-medium text-white/80 bg-black/40 backdrop-blur-sm border border-white/10">
        Video coming soon
      </span>
    </>
  );
};

const GlassCarousel = () => {
  const [[index, direction], setSlide] = useState([0, 0]);
  const total = MEDIA_ITEMS.length;
  const hasMultiple = total > 1;

  const go = useCallback(
    dir => {
      setSlide(([current]) => [(current + dir + total) % total, dir]);
    },
    [total]
  );

  return (
    <div className="relative w-full max-w-md aspect-[4/5] mx-auto">
      <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <MediaSlide item={MEDIA_ITEMS[index]} />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10 pointer-events-none" />
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {MEDIA_ITEMS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
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
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const paragraphTimer = setTimeout(() => setShowParagraph(true), 350);
    return () => clearTimeout(paragraphTimer);
  }, [inView]);

  useEffect(() => {
    if (!showParagraph || pillsVisible >= HIGHLIGHTS.length) return;
    const pillTimer = setTimeout(() => setPillsVisible(v => v + 1), pillsVisible === 0 ? 500 : 90);
    return () => clearTimeout(pillTimer);
  }, [showParagraph, pillsVisible]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <ShapeGrid
          speed={0.4}
          squareSize={40}
          direction="diagonal"
          borderColor="#413C52"
          hoverFillColor="#222"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left - content */}
        <div>
          {inView && (
            <BlurText
              text="About Us"
              direction="top"
              delay={60}
              stepDuration={0.4}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            />
          )}

          {showParagraph && (
            <BlurText
              text={ABOUT_PARAGRAPH}
              direction="top"
              delay={6}
              stepDuration={0.28}
              className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8 max-w-xl"
            />
          )}

          <div className="flex flex-wrap gap-3 mb-12">
            {HIGHLIGHTS.map((pill, i) =>
              i < pillsVisible ? (
                <BlurText
                  key={pill}
                  text={pill}
                  direction="top"
                  stepDuration={0.3}
                  className="!inline-flex !flex-nowrap px-4 py-1.5 rounded-full text-sm font-medium text-white bg-white/5 border border-white/10 backdrop-blur-sm"
                />
              ) : null
            )}
          </div>

          {/* <div className="flex flex-wrap gap-10">
            {STATS.map(stat => (
              <div key={stat.label}>
                <div className="font-display text-3xl sm:text-4xl font-bold text-white flex items-baseline">
                  <CountUp to={stat.to} duration={2} />
                  <span>{stat.suffix}</span>
                </div>
                <div className="text-sm text-[#A1A1AA] mt-1">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>

        {/* Right - glassmorphism carousel (animates in after the text content finishes,
            so on mobile - where this stacks below the text - it doesn't visually "jump
            in" ahead of it) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={pillsVisible >= HIGHLIGHTS.length ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCarousel />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;