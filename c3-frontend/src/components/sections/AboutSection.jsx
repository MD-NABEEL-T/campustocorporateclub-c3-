import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, GraduationCap, Laptop, Users, Target, Presentation, Award } from 'lucide-react';
import BlurText from '../reactbits/BlurText';

const ABOUT_PARAGRAPH =
  'Campus to Corporate Club (C3) is the official Computer Science and Engineering department club at CAHCET. We believe learning becomes more meaningful when students teach, collaborate, organize, and build together. Through technical sessions, workshops, events, and peer learning, members strengthen both their technical and professional skills while developing communication, leadership, teamwork, and confidence.';

const PILLARS = [
  {
    icon: GraduationCap,
    title: 'Learn by Teaching',
    desc: 'Daily 15-minute peer sessions where juniors and seniors break down complex topics together.'
  },
  {
    icon: Laptop,
    title: 'Hands-on Building',
    desc: 'Collaborative development across web, AI/ML, cloud, and security tracks.'
  },
  {
    icon: Presentation,
    title: 'Corporate Prep',
    desc: 'Public speaking drills, presentation mastery, and real-world aptitude training.'
  },
  {
    icon: Award,
    title: 'Leadership & Events',
    desc: 'Organize high-impact campus events, hackathons, and technical symposiums.'
  }
];

const MEDIA_ITEMS = [
  { type: 'video', src: '', poster: '/assets/c3fullmembers.jpg.jpeg', alt: 'C3 Community Members' }
];

const MediaShowcase = () => {
  return (
    <div className="relative w-full max-w-md aspect-[4/5] mx-auto group">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#38BDF8]/20 via-[#818CF8]/20 to-[#2DD4BF]/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-full rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-white/15 shadow-[0_12px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Soft background blurred cover */}
        <img
          src="/assets/c3fullmembers.jpg.jpeg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-40"
        />
        <img
          src="/assets/c3fullmembers.jpg.jpeg"
          alt="C3 Community Members"
          className="absolute inset-0 w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        <div className="absolute bottom-5 inset-x-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white tracking-wide">C3 Community</div>
            <div className="text-[11px] text-[#A1A1AA]">CAHCET CSE Department</div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-semibold text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/25 backdrop-blur-md">
            Est. CAHCET
          </span>
        </div>
      </div>
    </div>
  );
};

export const AboutSection = () => {
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-black"
    >
      {/* Technical blueprint grid atmosphere */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(56,189,248,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,rgba(45,212,191,0.06),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Column - Content & Pillars */}
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-nav font-medium text-[#2DD4BF] bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 mb-4">
            About the Club
          </div>

          {inView && (
            <BlurText
              text="Empowering Students from Campus to Corporate"
              direction="top"
              delay={35}
              stepDuration={0.3}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            />
          )}

          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8">
            {ABOUT_PARAGRAPH}
          </p>

          {/* 4 Thematic Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PILLARS.map((pillar, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#38BDF8]/40 hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <pillar.icon className="w-4 h-4" />
                </div>
                <div className="text-sm font-semibold text-white mb-1">{pillar.title}</div>
                <div className="text-xs text-[#8E8E93] leading-relaxed">{pillar.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Media Showcase */}
        <div className="lg:col-span-5 w-full">
          <MediaShowcase />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;