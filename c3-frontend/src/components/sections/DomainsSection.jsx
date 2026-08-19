import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiTailwindcss,
  SiFigma,
  SiPython,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiLinux,
  SiWireshark,
  SiKalilinux,
  SiDocker,
  SiMysql,
  SiPandas,
  SiNumpy
} from 'react-icons/si';
import BlurText from '../reactbits/BlurText';
import ViewportGate from '../reactbits/ViewportGate';
import LetterGlitch from '../reactbits/LetterGlitch';
import DotField from '../reactbits/DotField';

// Galaxy/Strands/MagicRings pull in three.js and ogl (WebGL) - heavy, so
// they're lazy-loaded and only fetched once a domain row scrolls into view.
const Galaxy = lazy(() => import('../reactbits/Galaxy'));
const Strands = lazy(() => import('../reactbits/Strands'));
const MagicRings = lazy(() => import('../reactbits/MagicRings'));

// Mock data only - these will later link into the Team section.
const DOMAINS = [
  {
    number: '01',
    title: 'Design & Development',
    accent: '#2DD4BF',
    description:
      'Transform ideas into beautiful digital experiences. Learn modern UI/UX principles, frontend development, backend technologies, and full-stack application development through real-world projects and collaborative learning.',
    techStack: [
      { icon: SiHtml5, label: 'HTML5', color: '#E34F26' },
      { icon: SiCss, label: 'CSS3', color: '#1572B6' },
      { icon: SiJavascript, label: 'JavaScript', color: '#F7DF1E' },
      { icon: SiReact, label: 'React', color: '#61DAFB' },
      { icon: SiTailwindcss, label: 'Tailwind', color: '#38BDF8' },
      { icon: SiFigma, label: 'Figma', color: '#F24E1E' }
    ],
    members: [
      { name: 'Aarav Sharma', role: 'Domain Lead' },
      { name: 'Diya Patel', role: 'Core Member' },
      { name: 'Kabir Mehta', role: 'Core Member' }
    ],
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
    title: 'Data Analytics',
    accent: '#F59E0B',
    description:
      'Convert raw data into meaningful insights using visualization, statistical analysis, dashboards, and business intelligence tools that drive informed decisions.',
    techStack: [
      { icon: SiPython, label: 'Python', color: '#3776AB' },
      { icon: SiMysql, label: 'MySQL', color: '#4479A1' },
      { icon: SiPandas, label: 'Pandas', color: '#150458' },
      { icon: SiNumpy, label: 'NumPy', color: '#013243' },
      { icon: BarChart3, label: 'Power BI', color: '#F2C811' }
    ],
    members: [
      { name: 'Sanya Kapoor', role: 'Domain Lead' },
      { name: 'Aditya Menon', role: 'Core Member' }
    ],
    background: (
      <DotField
        dotRadius={2.2}
        dotSpacing={13}
        bulgeStrength={50}
        glowRadius={140}
        waveAmplitude={5}
        gradientFrom="rgba(245, 158, 11, 0.65)"
        gradientTo="rgba(56, 189, 248, 0.45)"
        glowColor="#F59E0B"
      />
    )
  },
  {
    number: '03',
    title: 'Artificial Intelligence & Machine Learning',
    accent: '#818CF8',
    description:
      'Explore the future of intelligent systems by building machine learning models, experimenting with AI tools, and solving real-world challenges through data-driven thinking.',
    techStack: [
      { icon: SiPython, label: 'Python', color: '#3776AB' },
      { icon: SiTensorflow, label: 'TensorFlow', color: '#FF6F00' },
      { icon: SiPytorch, label: 'PyTorch', color: '#EE4C2C' },
      { icon: SiScikitlearn, label: 'Scikit-learn', color: '#F7931E' }
    ],
    members: [
      { name: 'Ishaan Rao', role: 'Domain Lead' },
      { name: 'Ananya Iyer', role: 'Core Member' }
    ],
    background: (
      <Galaxy density={1} glowIntensity={0.4} saturation={0.2} hueShift={220} twinkleIntensity={0.4} rotationSpeed={0.08} starSpeed={0.4} speed={0.8} />
    )
  },
  {
    number: '04',
    title: 'Cybersecurity & Networks',
    accent: '#38BDF8',
    description:
      'Learn how digital systems communicate, secure networks against threats, and understand ethical hacking through hands-on exploration and security-first thinking.',
    techStack: [
      { icon: SiLinux, label: 'Linux', color: '#FCC624' },
      { icon: SiPython, label: 'Python', color: '#3776AB' },
      { icon: SiWireshark, label: 'Wireshark', color: '#1679A7' },
      { icon: SiKalilinux, label: 'Kali Linux', color: '#557C94' },
      { icon: SiDocker, label: 'Docker', color: '#2496ED' }
    ],
    members: [
      { name: 'Rohan Nair', role: 'Domain Lead' },
      { name: 'Meera Krishnan', role: 'Core Member' },
      { name: 'Vivaan Joshi', role: 'Core Member' }
    ],
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
    number: '05',
    title: 'Public Speaking & Corporate Communication',
    accent: '#FB7185',
    description:
      'Develop confidence in public speaking, technical presentations, leadership, teamwork, and professional communication essential for every successful engineer.',
    skills: ['Public Speaking', 'Presentation', 'Leadership', 'Teamwork'],
    members: [
      { name: 'Neha Bhatt', role: 'Domain Lead' },
      { name: 'Arjun Verma', role: 'Core Member' },
      { name: 'Priya Suresh', role: 'Core Member' }
    ],
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

const initialsOf = name =>
  name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const MemberProfile = ({ member, accent }) => (
  <div
    role="button"
    tabIndex={0}
    className="group flex items-center gap-2 rounded-full pr-2.5 pl-1 py-1 border border-white/10 bg-black/30 cursor-pointer transition-all duration-200 hover:bg-black/50 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
    style={{ '--accent': accent }}
  >
    <div
      className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold text-white border transition-colors duration-200 group-hover:border-[var(--accent)]"
      style={{ backgroundColor: `${accent}33`, borderColor: `${accent}66` }}
    >
      {initialsOf(member.name)}
    </div>
    <div className="leading-tight">
      <p className="text-[13px] text-white font-medium">{member.name}</p>
      {member.role && <p className="text-[10px] text-[#A1A1AA]">{member.role}</p>}
    </div>
  </div>
);

const TechChip = ({ tech }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#E4E4E7] bg-black/30 border border-white/10">
    <tech.icon className="w-3 h-3" style={{ color: tech.color }} />
    {tech.label}
  </div>
);

// One premium card per domain: the ReactBits component is the card's own
// full-bleed background (not a separate boxed panel above the text), with a
// graduated scrim - lighter near the top where the large number/title can
// tolerate a busier backdrop, progressively darker toward the bottom where
// the description/tech/member text needs solid contrast. The animation is
// always visible, never fully hidden, and clipped to the card via
// overflow-hidden so it can never bleed outside it or cause overflow.
const DomainCard = ({ domain }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="relative w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
  >
    <div className="relative flex flex-col h-full min-h-[440px] sm:min-h-[460px] rounded-3xl border border-white/10 bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <ViewportGate>{domain.background}</ViewportGate>
        </Suspense>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/65 to-black/88" />

      <div className="relative z-10 flex flex-col h-full p-6 sm:p-7">
        <span
          className="font-display text-4xl sm:text-5xl font-bold leading-none select-none block [text-shadow:0_2px_16px_rgba(0,0,0,0.85)]"
          style={{ color: domain.accent }}
        >
          {domain.number}
        </span>

        <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-2 mb-3 [text-shadow:0_2px_16px_rgba(0,0,0,0.85)]">
          {domain.title}
        </h3>

        <p className="text-sm sm:text-[15px] text-[#D4D4D8] leading-relaxed mb-5">
          {domain.description}
        </p>

        <div className="mb-5">
          <div className="flex flex-wrap gap-1.5">
            {domain.techStack
              ? domain.techStack.map(tech => <TechChip key={tech.label} tech={tech} />)
              : domain.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#E4E4E7] bg-black/30 border border-white/10"
                  >
                    {skill}
                  </span>
                ))}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-[10px] uppercase tracking-wide text-[#A1A1AA] mb-2">Domain Members</p>
          <div className="flex flex-wrap gap-2">
            {domain.members.map(member => (
              <MemberProfile key={member.name} member={member} accent={domain.accent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export const DomainsSection = () => {
  const introRef = useRef(null);
  const [introInView, setIntroInView] = useState(false);
  const [showIntroParagraph, setShowIntroParagraph] = useState(false);

  useEffect(() => {
    const node = introRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntroInView(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!introInView) return;
    const timer = setTimeout(() => setShowIntroParagraph(true), 350);
    return () => clearTimeout(timer);
  }, [introInView]);

  return (
    <section id="domains" className="relative w-full bg-black overflow-hidden py-24 sm:py-28">
      <div ref={introRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {introInView && (
          <BlurText
            text="Our Domains"
            direction="top"
            delay={60}
            stepDuration={0.4}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          />
        )}

        {showIntroParagraph && (
          <BlurText
            text="Discover the areas where our members learn, teach, collaborate, and grow throughout their journey at C3."
            direction="top"
            delay={6}
            stepDuration={0.28}
            className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-xl"
          />
        )}
      </div>

      {/* Card grid: 3-up on desktop (wrapping to a centered 2-card second
          row for 5 items), 2-up on tablet, 1-up on mobile. Widths are
          computed to match `gap-6` exactly at every breakpoint so rows wrap
          cleanly and `justify-center` centers any trailing partial row. */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-6">
          {DOMAINS.map(domain => (
            <DomainCard key={domain.title} domain={domain} />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-20">
        <div className="h-px w-24 mx-auto mb-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-snug">
          Different Domains. <span className="text-[#71717A]">One Community.</span>
        </h3>
        <p className="mt-4 text-lg sm:text-xl text-[#A1A1AA] font-medium">
          Learn Together. Build Together. Lead Together.
        </p>
      </div>
    </section>
  );
};

export default DomainsSection;