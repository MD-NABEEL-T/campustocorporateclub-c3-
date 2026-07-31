import { useEffect, useRef, useState } from 'react';
import BlurText from '../BlurText';
import CountUp from '../CountUp';
import Carousel from '../Carousel';
import Masonry from '../Masonry';

// Mock data only - shaped to match a future API response so swapping in
// real backend/Cloudinary data later won't require restructuring the UI.
// Expected shape per event: { title, slug, category, date, participantCount,
// coverImage, description, gallery: string[] }
const EVENTS = [
  {
    title: 'Hackathon & Debate',
    slug: 'hackathon',
    category: 'Hackathon',
    date: '2025',
    participantCount: 120,
    description: 'A day of rapid builds, sharp arguments, and bold ideas defended live.',
    coverImage: 'https://picsum.photos/seed/c3-hackathon-cover/900/600?grayscale',
    gallery: [
      'https://picsum.photos/seed/c3-hackathon-1/600/800?grayscale',
      'https://picsum.photos/seed/c3-hackathon-2/600/600?grayscale',
      'https://picsum.photos/seed/c3-hackathon-3/600/750?grayscale'
    ]
  },
  {
    title: 'GitHub & LinkedIn Workshop',
    slug: 'github-linkedin',
    category: 'Workshop',
    date: '2025',
    participantCount: 85,
    description: 'Hands-on session on building a developer profile that actually gets noticed.',
    coverImage: 'https://picsum.photos/seed/c3-github-cover/900/600?grayscale',
    gallery: [
      'https://picsum.photos/seed/c3-github-1/600/700?grayscale',
      'https://picsum.photos/seed/c3-github-2/600/850?grayscale'
    ]
  },
  {
    title: 'Domains Session',
    slug: 'domains',
    category: 'Session',
    date: '2024',
    participantCount: 150,
    description: 'An introduction to every domain at C3, taught by the members who live them.',
    coverImage: 'https://picsum.photos/seed/c3-domains-cover/900/600?grayscale',
    gallery: [
      'https://picsum.photos/seed/c3-domains-1/600/600?grayscale',
      'https://picsum.photos/seed/c3-domains-2/600/750?grayscale',
      'https://picsum.photos/seed/c3-domains-3/600/650?grayscale'
    ]
  },
  {
    title: 'Sprintathon',
    slug: 'sprintathon',
    category: 'Sprint',
    date: '2024',
    participantCount: 95,
    description: 'Short sprints, tight deadlines, and a room full of people who shipped anyway.',
    coverImage: 'https://picsum.photos/seed/c3-sprint-cover/900/600?grayscale',
    gallery: [
      'https://picsum.photos/seed/c3-sprint-1/600/800?grayscale',
      'https://picsum.photos/seed/c3-sprint-2/600/600?grayscale'
    ]
  }
];

const STORY_LINES = [
  'Every event begins with an idea.',
  'Every idea becomes an experience.',
  'Every experience becomes a memory.'
];

const STATS = [
  { to: 10, suffix: '+', label: 'Events' },
  { to: 200, suffix: '+', label: 'Participants' },
  { to: 30, suffix: '+', label: 'Sessions' }
];

const carouselItems = EVENTS.map(event => ({
  id: event.slug,
  title: event.title,
  description: event.description,
  image: event.coverImage,
  category: event.category,
  year: event.date,
  participants: event.participantCount,
  href: `/events/${event.slug}`
}));

const galleryItems = EVENTS.flatMap(event =>
  event.gallery.map((img, i) => ({
    id: `${event.slug}-${i}`,
    img,
    url: `/events/${event.slug}`,
    height: 300 + ((i * 73 + event.slug.length * 17) % 220)
  }))
);

const useMeasuredWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
};

const StoryTransition = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      setVisibleLines(0);
      return;
    }
    if (visibleLines >= STORY_LINES.length) return;
    const timer = setTimeout(() => setVisibleLines(v => v + 1), visibleLines === 0 ? 200 : 450);
    return () => clearTimeout(timer);
  }, [inView, visibleLines]);

  return (
    <div ref={ref} className="max-w-2xl mx-auto text-center py-20 px-4">
      {STORY_LINES.map((line, i) =>
        i < visibleLines ? (
          <BlurText
            key={line}
            text={line}
            direction="top"
            delay={30}
            stepDuration={0.35}
            className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-white/90 mb-2 justify-center"
          />
        ) : (
          <div key={line} className="h-[1em] sm:h-[1.2em] md:h-[1.4em] mb-2" />
        )
      )}
    </div>
  );
};

const ClosingCTA = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center py-16 px-4">
      {inView && (
        <BlurText
          text="The next memory could be yours."
          direction="top"
          delay={40}
          stepDuration={0.35}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white justify-center"
        />
      )}
    </div>
  );
};

export const EventsSection = () => {
  const introRef = useRef(null);
  const [introInView, setIntroInView] = useState(false);
  const [showIntroParagraph, setShowIntroParagraph] = useState(false);
  const [carouselRef, carouselWidth] = useMeasuredWidth();

  useEffect(() => {
    const node = introRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntroInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!introInView) {
      setShowIntroParagraph(false);
      return;
    }
    const timer = setTimeout(() => setShowIntroParagraph(true), 350);
    return () => clearTimeout(timer);
  }, [introInView]);

  return (
    <section id="events" className="relative w-full bg-black overflow-hidden py-24 sm:py-28">
      {/* Featured events */}
      <div ref={introRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <p className="text-xs uppercase tracking-widest text-[#38BDF8] font-medium mb-3">Our Events</p>
        {introInView && (
          <BlurText
            text="Learning through experience. Building memories together."
            direction="top"
            delay={40}
            stepDuration={0.35}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white max-w-3xl"
          />
        )}
      </div>

      <div ref={carouselRef} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {showIntroParagraph && (
          <Carousel
            items={carouselItems}
            baseWidth={Math.max(carouselWidth, 280)}
            itemHeight={440}
            autoplay
            autoplayDelay={5000}
            pauseOnHover
            loop
          />
        )}
      </div>

      {/* Story transition */}
      <StoryTransition />

      {/* Event gallery */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <p className="text-xs uppercase tracking-widest text-[#71717A] mb-6">From past events</p>
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ height: 900 }}>
        <Masonry
          items={galleryItems}
          ease="power3.out"
          duration={0.5}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.96}
          blurToFocus
          colorShiftOnHover={false}
        />
      </div>

      {/* Event statistics */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-3 gap-8 text-center">
          {STATS.map(stat => (
            <div key={stat.label}>
              <div className="font-display text-4xl sm:text-5xl font-bold text-white flex items-baseline justify-center">
                <CountUp to={stat.to} duration={2} />
                <span>{stat.suffix}</span>
              </div>
              <div className="text-sm text-[#A1A1AA] mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing transition into Join Us */}
      <ClosingCTA />
    </section>
  );
};

export default EventsSection;