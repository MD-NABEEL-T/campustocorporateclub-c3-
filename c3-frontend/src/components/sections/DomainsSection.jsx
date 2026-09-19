import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Code2, Database, Brain, ShieldAlert, Mic } from 'lucide-react';
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

// Custom lightweight SVG/CSS backdrops tailored per domain (0% GPU/WebGL load)
const DomainBackdrop = ({ type, accent }) => {
  if (type === 'dev') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.35),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        <Code2 className="absolute -bottom-6 -right-6 w-36 h-36 text-[#2DD4BF]/10" />
      </div>
    );
  }
  if (type === 'data') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.35),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(#F59E0B15_1px,transparent_1px)] bg-[size:18px_18px]" />
        <Database className="absolute -bottom-6 -right-6 w-36 h-36 text-[#F59E0B]/10" />
      </div>
    );
  }
  if (type === 'aiml') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.35),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#818CF80d_1px,transparent_1px),linear-gradient(-45deg,#818CF80d_1px,transparent_1px)] bg-[size:20px_20px]" />
        <Brain className="absolute -bottom-6 -right-6 w-36 h-36 text-[#818CF8]/10" />
      </div>
    );
  }
  if (type === 'cyber') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38BDF80a_1px,transparent_1px),linear-gradient(to_bottom,#38BDF80a_1px,transparent_1px)] bg-[size:16px_16px]" />
        <ShieldAlert className="absolute -bottom-6 -right-6 w-36 h-36 text-[#38BDF8]/10" />
      </div>
    );
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(251,113,133,0.35),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(#FB718515_1px,transparent_1px)] bg-[size:22px_22px]" />
      <Mic className="absolute -bottom-6 -right-6 w-36 h-36 text-[#FB7185]/10" />
    </div>
  );
};

const DOMAINS = [
  {
    number: '01',
    title: 'Design & Development',
    accent: '#2DD4BF',
    type: 'dev',
    description:
      'Transform ideas into beautiful digital experiences. Learn modern UI/UX principles, frontend development, backend systems, and full-stack application architecture through real-world projects and collaborative building.',
    techStack: [
      { icon: SiHtml5, label: 'HTML5', color: '#E34F26' },
      { icon: SiCss, label: 'CSS3', color: '#1572B6' },
      { icon: SiJavascript, label: 'JavaScript', color: '#F7DF1E' },
      { icon: SiReact, label: 'React', color: '#61DAFB' },
      { icon: SiTailwindcss, label: 'Tailwind', color: '#38BDF8' },
      { icon: SiFigma, label: 'Figma', color: '#F24E1E' }
    ],
    members: [
      { name: 'Nabeel', role: 'Domain Lead' },
      { name: 'DHIVYA THARINI KB', role: 'Core Member' }
    ]
  },
  {
    number: '02',
    title: 'Data Analytics',
    accent: '#F59E0B',
    type: 'data',
    description:
      'Convert raw data into meaningful insights using visualization, statistical modeling, dashboards, and business intelligence tools that drive informed decision making.',
    techStack: [
      { icon: SiPython, label: 'Python', color: '#3776AB' },
      { icon: SiMysql, label: 'MySQL', color: '#4479A1' },
      { icon: SiPandas, label: 'Pandas', color: '#150458' },
      { icon: SiNumpy, label: 'NumPy', color: '#013243' },
      { icon: BarChart3, label: 'Power BI', color: '#F2C811' }
    ],
    members: [
      { name: 'Deepadharshini Sankar', role: 'Core Member' },
      { name: 'S Mohammad Saifullah Roomy', role: 'Core Member' }
    ]
  },
  {
    number: '03',
    title: 'Artificial Intelligence & Machine Learning',
    accent: '#818CF8',
    type: 'aiml',
    description:
      'Explore the future of intelligent systems by building machine learning models, experimenting with neural networks, and solving real-world challenges through data-driven thinking.',
    techStack: [
      { icon: SiPython, label: 'Python', color: '#3776AB' },
      { icon: SiTensorflow, label: 'TensorFlow', color: '#FF6F00' },
      { icon: SiPytorch, label: 'PyTorch', color: '#EE4C2C' },
      { icon: SiScikitlearn, label: 'Scikit-learn', color: '#F7931E' }
    ],
    members: [
      { name: 'Shareen Begum.Z', role: 'Core Member' },
      { name: 'Sahira Fathima N', role: 'Core Member' },
      { name: 'Bargavi R', role: 'Core Member' }
    ]
  },
  {
    number: '04',
    title: 'Cybersecurity & Networks',
    accent: '#38BDF8',
    type: 'cyber',
    description:
      'Learn how digital networks communicate, secure infrastructure against threats, and understand ethical hacking through hands-on exploration and security-first engineering.',
    techStack: [
      { icon: SiLinux, label: 'Linux', color: '#FCC624' },
      { icon: SiPython, label: 'Python', color: '#3776AB' },
      { icon: SiWireshark, label: 'Wireshark', color: '#1679A7' },
      { icon: SiKalilinux, label: 'Kali Linux', color: '#557C94' },
      { icon: SiDocker, label: 'Docker', color: '#2496ED' }
    ],
    members: [
      { name: 'Ashfaq Ahmed. M', role: 'Domain Lead' },
      { name: 'Mohamed Riyaz M', role: 'Core Member' },
      { name: 'Mohamed Zaid', role: 'Core Member' },
      { name: 'Mohammed Owais Ansari', role: 'Core Member' }
    ]
  },
  {
    number: '05',
    title: 'Public Speaking & Corporate Communication',
    accent: '#FB7185',
    type: 'speech',
    description:
      'Develop confidence in public speaking, technical presentations, leadership, teamwork, and articulate communication.',
    skills: ['Public Speaking', 'Technical Presentations', 'Leadership', 'Group Discussions'],
    members: [
      { name: 'Harini Radhakrishnan', role: 'Domain Lead' }
    ]
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
    className="group flex items-center gap-2 rounded-full pr-2.5 pl-1 py-1 border border-white/10 bg-black/40 cursor-pointer transition-all duration-200 hover:bg-black/70 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
    style={{ '--accent': accent }}
  >
    <div
      className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-semibold text-white border transition-colors duration-200 group-hover:border-[var(--accent)]"
      style={{ backgroundColor: `${accent}25`, borderColor: `${accent}55` }}
    >
      {initialsOf(member.name)}
    </div>
    <div className="leading-tight">
      <p className="text-[12px] sm:text-[13px] text-white font-medium">{member.name}</p>
      {member.role && <p className="text-[10px] text-[#A1A1AA]">{member.role}</p>}
    </div>
  </div>
);

const TechChip = ({ tech }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium text-[#E4E4E7] bg-black/40 border border-white/10">
    <tech.icon className="w-3 h-3" style={{ color: tech.color }} />
    {tech.label}
  </div>
);

const DomainCard = ({ domain }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="relative w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
  >
    <div className="relative flex flex-col h-full min-h-[440px] sm:min-h-[460px] rounded-3xl border border-white/10 bg-[#07090D] hover:border-white/20 transition-colors overflow-hidden">
      {/* Bespoke CSS/SVG Backdrop */}
      <DomainBackdrop type={domain.type} accent={domain.accent} />

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/85 pointer-events-none" />

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
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium text-[#E4E4E7] bg-black/40 border border-white/10"
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
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-xl"
          >
            Discover the areas where our members learn, teach, collaborate, and grow throughout their journey at C3.
          </motion.p>
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