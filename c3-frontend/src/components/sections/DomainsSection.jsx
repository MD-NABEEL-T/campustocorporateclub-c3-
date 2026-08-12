import { useState, useEffect, useRef } from 'react';
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
import Galaxy from '../reactbits/Galaxy';
import Strands from '../reactbits/Strands';
import DotField from '../reactbits/DotField';
import MagicRings from '../reactbits/MagicRings';

// Tracks the lg breakpoint so DomainRow renders exactly one background
// instance (boxed panel on desktop, full-bleed backdrop on mobile) instead
// of mounting both and hiding one with CSS.
const useIsDesktop = (breakpoint = 1024) => {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= breakpoint
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = e => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isDesktop;
};

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
    title: 'AI & ML',
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
    number: '03',
    title: 'Networking & Cybersecurity',
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
    number: '04',
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
    className="group flex items-center gap-2.5 rounded-full pr-3 pl-1.5 py-1.5 border border-white/10 bg-white/[0.03] cursor-pointer transition-all duration-200 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
    style={{ '--accent': accent }}
  >
    <div
      className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-semibold text-white border transition-colors duration-200 group-hover:border-[var(--accent)]"
      style={{ backgroundColor: `${accent}22`, borderColor: `${accent}55` }}
    >
      {initialsOf(member.name)}
    </div>
    <div className="leading-tight">
      <p className="text-sm text-white font-medium">{member.name}</p>
      {member.role && <p className="text-[11px] text-[#71717A]">{member.role}</p>}
    </div>
  </div>
);

const TechChip = ({ tech }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#E4E4E7] bg-white/5 border border-white/10">
    <tech.icon className="w-3.5 h-3.5" style={{ color: tech.color }} />
    {tech.label}
  </div>
);

const DomainRow = ({ domain, index }) => {
  const reversed = index % 2 === 1;
  const isDesktop = useIsDesktop();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      {!isDesktop && (
        <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
          <ViewportGate>{domain.background}</ViewportGate>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80" />
        </div>
      )}

      <div
        className={`relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
          reversed ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        {isDesktop && (
          <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden border border-white/10 bg-black">
            <ViewportGate>{domain.background}</ViewportGate>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="font-display text-6xl sm:text-7xl font-bold leading-none select-none block"
            style={{ color: `${domain.accent}4d` }}
          >
            {domain.number}
          </span>

          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            {domain.title}
          </h3>

          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-lg mb-6">
            {domain.description}
          </p>

          <div className="mb-8">
            {domain.techStack && (
              <p className="text-xs uppercase tracking-wide text-[#71717A] mb-2.5">Tech We Use</p>
            )}
            <div className="flex flex-wrap gap-2">
              {domain.techStack
                ? domain.techStack.map(tech => <TechChip key={tech.label} tech={tech} />)
                : domain.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-[#E4E4E7] bg-white/5 border border-white/10"
                    >
                      {skill}
                    </span>
                  ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-[#71717A] mb-2.5">Domain Members</p>
            <div className="flex flex-wrap gap-2.5">
              {domain.members.map(member => (
                <MemberProfile key={member.name} member={member} accent={domain.accent} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

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

      <div className="relative z-10 divide-y divide-white/5">
        {DOMAINS.map((domain, index) => (
          <DomainRow key={domain.title} domain={domain} index={index} />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-8">
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