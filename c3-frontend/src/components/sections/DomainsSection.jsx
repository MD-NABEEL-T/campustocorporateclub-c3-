import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import LetterGlitch from '../LetterGlitch';
import Galaxy from '../Galaxy';
import Strands from '../Strands';
import DotField from '../DotField';
import MagicRings from '../MagicRings';

// Mounts its children only once the panel scrolls into view, so five
// simultaneous WebGL/canvas backgrounds don't all initialize on page load.
const LazyMount = ({ children, rootMargin = '200px' }) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} className="absolute inset-0">
      {mounted && children}
    </div>
  );
};

const DOMAINS = [
  {
    number: '01',
    title: 'Design & Development',
    description:
      'From wireframes to shipped products - members design clean interfaces and build them with modern web technologies.',
    skills: ['UI/UX', 'React', 'Figma', 'Web Development'],
    leads: ['Domain Lead Name', 'Domain Lead Name'],
    background: (
      <LetterGlitch
        glitchColors={['#0d1b1a', '#2DD4BF', '#38BDF8']}
        glitchSpeed={60}
        centerVignette
        outerVignette={false}
        smooth
      />
    )
  },
  {
    number: '02',
    title: 'AI & ML',
    description:
      'Exploring machine learning, data models, and intelligent systems through hands-on projects and study sessions.',
    skills: ['Python', 'Machine Learning', 'Neural Networks', 'Data Modeling'],
    leads: ['Domain Lead Name', 'Domain Lead Name'],
    background: (
      <Galaxy density={1} glowIntensity={0.4} saturation={0.2} hueShift={220} twinkleIntensity={0.4} rotationSpeed={0.08} starSpeed={0.4} speed={0.8} />
    )
  },
  {
    number: '03',
    title: 'Networking & Cybersecurity',
    description:
      'Understanding how systems connect and how to defend them - covering networking fundamentals, security practices, and ethical hacking.',
    skills: ['Networking', 'Cybersecurity', 'Linux', 'Ethical Hacking'],
    leads: ['Domain Lead Name', 'Domain Lead Name'],
    background: (
      <Strands
        colors={['#38BDF8', '#0f172a', '#1e293b']}
        count={4}
        speed={0.5}
        amplitude={1}
        waviness={1.2}
        thickness={0.6}
        glow={2.2}
        spread={1.1}
      />
    )
  },
  {
    number: '04',
    title: 'Data Analytics',
    description:
      'Turning raw numbers into insight - members learn to collect, visualize, and interpret data to support real decisions.',
    skills: ['SQL', 'Data Visualization', 'Excel', 'Power BI'],
    leads: ['Domain Lead Name', 'Domain Lead Name'],
    background: (
      <DotField
        dotRadius={1.4}
        dotSpacing={16}
        bulgeStrength={50}
        glowRadius={140}
        gradientFrom="rgba(56, 189, 248, 0.35)"
        gradientTo="rgba(45, 212, 191, 0.25)"
        glowColor="#0B1220"
      />
    )
  },
  {
    number: '05',
    title: 'Communication Skills',
    description:
      'Building the confidence to speak, present, and lead - because every technical idea needs someone who can communicate it well.',
    skills: ['Public Speaking', 'Presentation', 'Teamwork', 'Leadership'],
    leads: ['Domain Lead Name', 'Domain Lead Name'],
    background: (
      <MagicRings
        color="#A1A1AA"
        colorTwo="#38BDF8"
        ringCount={6}
        speed={0.8}
        baseRadius={0.24}
        radiusStep={0.12}
        lineThickness={1.6}
        fadeIn={0.7}
        fadeOut={0.5}
      />
    )
  }
];

const DomainRow = ({ domain, index }) => {
  const reversed = index % 2 === 1;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
          reversed ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        {/* Animated background panel */}
        <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden border border-white/10 bg-black">
          <LazyMount>{domain.background}</LazyMount>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
        </div>

        {/* Content */}
        <div>
          <span className="font-display text-6xl sm:text-7xl font-bold text-white/10 leading-none select-none">
            {domain.number}
          </span>

          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            {domain.title}
          </h3>

          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-6 max-w-lg">
            {domain.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {domain.skills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-medium text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-[#71717A] mb-2">Domain Leads</p>
            <div className="flex flex-wrap gap-3">
              {domain.leads.map((lead, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[11px] font-semibold text-white">
                    {lead
                      .split(' ')
                      .map(w => w[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <span className="text-sm text-[#D4D4D8]">{lead}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Explore Domain
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const DomainsSection = () => {
  return (
    <section id="domains" className="relative w-full bg-black overflow-hidden py-16">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <p className="text-xs uppercase tracking-widest text-[#71717A] mb-2">What we do</p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white">Domains</h2>
      </div>

      <div className="relative z-10 divide-y divide-white/5">
        {DOMAINS.map((domain, index) => (
          <DomainRow key={domain.title} domain={domain} index={index} />
        ))}
      </div>
    </section>
  );
};

export default DomainsSection;