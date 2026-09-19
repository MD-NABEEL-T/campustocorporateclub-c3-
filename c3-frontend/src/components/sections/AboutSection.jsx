import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Laptop,
  Presentation,
  Award,
  Users,
  Compass,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import BlurText from '../reactbits/BlurText';

const PILLARS = [
  {
    icon: GraduationCap,
    title: 'Learn by Teaching',
    badge: 'Daily 15-Min Slots',
    desc: 'Juniors and seniors take turns breaking down engineering concepts, cementing understanding through active explanation.',
    highlight: 'Peer-to-Peer'
  },
  {
    icon: Laptop,
    title: 'Hands-on Building',
    badge: 'Real-World Stack',
    desc: 'Collaborative development across web, AI/ML, cloud infrastructure, and security tracks to build real products.',
    highlight: 'Ship Weekly'
  },
  {
    icon: Presentation,
    title: 'Corporate Prep',
    badge: 'Placement Ready',
    desc: 'Communication mastery, aptitude drills, technical resume reviews, and live mock interview simulations.',
    highlight: 'Career First'
  },
  {
    icon: Award,
    title: 'Leadership & Events',
    badge: 'High Impact',
    desc: 'Organizing campus hackathons, symposiums, technical debate battles, and department showcases.',
    highlight: 'Student Run'
  }
];

const TABS = [
  {
    id: 'culture',
    label: 'Club Culture',
    icon: Users,
    headline: 'A student-driven collective where learning is an everyday habit.',
    description:
      'C3 eliminates the barrier between juniors and seniors. We believe that true engineering excellence comes not from cramming exams, but from continuous daily curiosity, open debate, and peer-to-peer mentorship.',
    points: [
      'Daily 15-minute presentation slots in the department',
      'Open discussion without fear of judgment or hierarchy',
      'Shared technical notes, problem sets, and roadmaps'
    ]
  },
  {
    id: 'execution',
    label: 'Execution Model',
    icon: Zap,
    headline: 'Continuous micro-actions that build corporate readiness.',
    description:
      'Rather than relying only on annual fests, C3 operates on a daily rhythm. Members present technical concepts, solve DSA problems together, build GitHub projects, and practice public speaking regularly.',
    points: [
      'Hands-on coding sprints across web, AI, and systems',
      'Placement aptitude and algorithmic problem solving',
      'Portfolio building and resume optimization'
    ]
  },
  {
    id: 'heritage',
    label: 'CAHCET CSE Heritage',
    icon: Compass,
    headline: 'The official department club fostering future leaders.',
    description:
      'Founded under the Computer Science and Engineering Department at CAHCET, C3 acts as the bridge connecting academic curriculum with modern industry expectations and startup culture.',
    points: [
      'Faculty-supported, student-executed initiatives',
      'Cross-batch collaboration between all engineering years',
      'Alumni interaction and industry mentorship'
    ]
  }
];

const STATS = [
  { value: '100+', label: 'Peer Sessions' },
  { value: '4', label: 'Tech Domains' },
  { value: '100%', label: 'Student-Driven' }
];

export const AboutSection = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [activeTab, setActiveTab] = useState('culture');

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
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const currentTab = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black text-white"
    >
      {/* Background architectural grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-white/90 bg-white/[0.06] border border-white/15 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            ABOUT THE CLUB
          </div>

          {inView ? (
            <BlurText
              text="Bridging the Gap Between Campus & Corporate"
              direction="top"
              delay={25}
              stepDuration={0.25}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            />
          ) : (
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Bridging the Gap Between Campus & Corporate
            </h2>
          )}

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Campus to Corporate Club (C3) is the official student-led engineering initiative of the Computer Science and
            Engineering department at CAHCET, dedicated to transforming aspiring students into industry-ready leaders.
          </p>
        </div>

        {/* 4 Pillars Interactive Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-400">
                      {pillar.highlight}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-white transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{pillar.desc}</p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {pillar.badge}
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-zinc-950/60 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
          {/* Left Column: Interactive Nav & Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tab selector */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-black/80 rounded-xl border border-white/10 w-fit">
              {TABS.map(tab => {
                const TabIcon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? 'bg-white text-black shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <h4 className="text-xl sm:text-2xl font-bold font-heading text-white">{currentTab.headline}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{currentTab.description}</p>

                <div className="space-y-2.5 pt-2">
                  {currentTab.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10">
              {STATS.map((stat, i) => (
                <div key={i} className="text-left">
                  <div className="text-xl sm:text-2xl font-bold font-heading text-white">{stat.value}</div>
                  <div className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual Community Media Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-black border border-white/15 overflow-hidden shadow-2xl group">
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src="/assets/c3fullmembers.jpg.jpeg"
                  alt="C3 Community Members"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>

              <div className="p-5 relative bg-zinc-950/90 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">C3 Core Community</div>
                  <div className="text-xs text-zinc-400">Department of Computer Science & Engineering</div>
                </div>
                <span className="px-2.5 py-1 rounded text-[10px] font-mono font-semibold text-white bg-white/10 border border-white/20">
                  CAHCET CSE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;