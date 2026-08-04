import { useEffect, useRef, useState } from 'react';
import BlurText from '../BlurText';
import CountUp from '../CountUp';
import Carousel from '../Carousel';
import Masonry from '../Masonry';
import api from '../../api/axios';

// Real events now come from GET /api/events (backend serves Cloudinary URLs
// for coverImage/gallery - see c3-backend/controllers/eventController.js).
// Expected shape per event: { title, slug, category, date, attendeeCount,
// coverImage, description, gallery: string[] }

const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    api.get('/events')
      .then(res => {
        if (!cancelled) setEvents(res.data);
      })
      .catch(err => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { events, loading, error };
};

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
  const { events, loading, error } = useEvents();

  const carouselItems = events.map(event => ({
    id: event.slug,
    title: event.title,
    description: event.description,
    image: event.coverImage,
    category: event.category,
    year: event.date,
    participants: event.attendeeCount,
    href: `/events/${event.slug}`
  }));

  const galleryItems = events.flatMap(event =>
    (event.gallery || []).map((img, i) => ({
      id: `${event.slug}-${i}`,
      img,
      url: `/events/${event.slug}`,
      height: 300 + ((i * 73 + event.slug.length * 17) % 220)
    }))
  );

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
        {loading && (
          <p className="text-center text-sm text-[#A1A1AA] py-12">Loading events…</p>
        )}
        {!loading && error && (
          <p className="text-center text-sm text-red-400 py-12">Couldn't load events right now.</p>
        )}
        {!loading && !error && carouselItems.length === 0 && (
          <p className="text-center text-sm text-[#A1A1AA] py-12">No events yet — check back soon.</p>
        )}
        {!loading && !error && showIntroParagraph && carouselItems.length > 0 && (
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