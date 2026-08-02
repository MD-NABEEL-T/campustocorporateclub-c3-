import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { User, RotateCw, ArrowUpRight } from 'lucide-react';
import BlurText from '../BlurText';
import Marquee from '../Marquee';
import FlipCard from '../FlipCard';

const slugify = name => name.toLowerCase().trim().replace(/\s+/g, '-');

// Mock data only - photos, names and quotes are placeholders.
const LEADERSHIP = [
  {
    name: 'Member Name',
    role: 'President',
    domain: 'Design & Development',
    accent: '#2DD4BF',
    quote: 'C3 taught me that leading means teaching, not just doing.'
  },
  {
    name: 'Member Name',
    role: 'Vice President',
    domain: 'AI & ML',
    accent: '#818CF8',
    quote: 'Every session is a chance to learn alongside the people we teach.'
  },
  {
    name: 'Member Name',
    role: 'Session Handler',
    domain: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    quote: 'Good sessions come from good questions, not just good slides.'
  },
  {
    name: 'Member Name',
    role: 'Event Manager',
    domain: 'Data Analytics',
    accent: '#F59E0B',
    quote: 'An event is just a team working well together, in public.'
  }
];

// 10 core members, split into two rows of 5 for the marquee.
const CORE_MEMBERS = [
  { name: 'Core Member One', tier: 'Senior Core Member', domain: 'Design & Development', accent: '#2DD4BF' },
  { name: 'Core Member Two', tier: 'Core Member', domain: 'Design & Development', accent: '#2DD4BF' },
  { name: 'Core Member Three', tier: 'Senior Core Member', domain: 'AI & ML', accent: '#818CF8' },
  { name: 'Core Member Four', tier: 'Core Member', domain: 'AI & ML', accent: '#818CF8' },
  { name: 'Core Member Five', tier: 'Senior Core Member', domain: 'Networking & Cybersecurity', accent: '#38BDF8' },
  { name: 'Core Member Six', tier: 'Core Member', domain: 'Networking & Cybersecurity', accent: '#38BDF8' },
  { name: 'Core Member Seven', tier: 'Senior Core Member', domain: 'Data Analytics', accent: '#F59E0B' },
  { name: 'Core Member Eight', tier: 'Core Member', domain: 'Data Analytics', accent: '#F59E0B' },
  { name: 'Core Member Nine', tier: 'Senior Core Member', domain: 'Communication Skills', accent: '#FB7185' },
  { name: 'Core Member Ten', tier: 'Core Member', domain: 'Communication Skills', accent: '#FB7185' }
];
const CORE_ROW_1 = CORE_MEMBERS.slice(0, 5);
const CORE_ROW_2 = CORE_MEMBERS.slice(5, 10);

const PhotoPlaceholder = ({ accent, className = '' }) => (
  <div
    className={`relative w-full overflow-hidden rounded-xl border ${className}`}
    style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}33` }}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <User className="w-7 h-7" style={{ color: `${accent}55` }} />
    </div>
  </div>
);

const FlipHint = ({ accent }) => (
  <span
    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border"
    style={{ borderColor: `${accent}44` }}
  >
    <RotateCw className="w-3 h-3 text-white/70" />
  </span>
);

const LeadershipCard = ({ leader, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className="h-56 sm:h-72"
  >
    <FlipCard
      className="w-full h-full"
      front={
        <div className="relative w-full h-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 flex flex-col">
          <FlipHint accent={leader.accent} />
          <PhotoPlaceholder accent={leader.accent} className="aspect-square mb-2.5" />
          <p
            className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide truncate"
            style={{ color: leader.accent }}
          >
            {leader.role}
          </p>
          <h4 className="font-display text-sm sm:text-lg font-bold text-white truncate">{leader.name}</h4>
        </div>
      }
      back={
        <div className="relative w-full h-full rounded-2xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-4 flex flex-col justify-between">
          <div>
            <p
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1"
              style={{ color: leader.accent }}
            >
              {leader.role}
            </p>
            <p className="text-[11px] sm:text-xs text-[#71717A] mb-2">{leader.domain}</p>
            <p className="text-xs sm:text-sm text-[#D4D4D8] italic leading-relaxed line-clamp-4">
              "{leader.quote}"
            </p>
          </div>
          <Link
            to={`/team/${slugify(leader.name)}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-white/80 hover:text-white"
          >
            View Profile <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      }
    />
  </motion.div>
);

const CoreMemberCard = ({ member }) => (
  <FlipCard
    className="w-[132px] h-[168px] sm:w-[150px] sm:h-[188px] shrink-0"
    front={
      <div className="relative w-full h-full rounded-xl border border-white/10 bg-white/[0.02] p-2.5 flex flex-col">
        <FlipHint accent={member.accent} />
        <PhotoPlaceholder accent={member.accent} className="aspect-square mb-2" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: member.accent }} />
          <p className="text-xs font-medium text-white truncate">{member.name}</p>
        </div>
      </div>
    }
    back={
      <div className="relative w-full h-full rounded-xl border border-white/10 bg-[#0a0a0a] p-2.5 flex flex-col justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: member.accent }}>
            {member.tier}
          </p>
          <p className="text-[11px] text-[#A1A1AA] leading-snug">{member.domain}</p>
        </div>
        <Link
          to={`/team/${slugify(member.name)}`}
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[10px] font-medium text-white/80 hover:text-white"
        >
          View <ArrowUpRight className="w-2.5 h-2.5" />
        </Link>
      </div>
    }
  />
);

const CoreMemberRow = ({ members, direction, delayStart }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: delayStart }}
      className="mb-4 last:mb-0"
    >
      <Marquee direction={direction} speed={26}>
        <div className="flex gap-4 pr-4">
          {members.map(member => (
            <CoreMemberCard key={member.name} member={member} />
          ))}
        </div>
      </Marquee>
    </motion.div>
  );
};

export const TeamSection = () => {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, amount: 0.4 });
  const [showIntroParagraph, setShowIntroParagraph] = useState(false);
  const coreHeadingRef = useRef(null);
  const coreHeadingInView = useInView(coreHeadingRef, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!introInView) return;
    const timer = setTimeout(() => setShowIntroParagraph(true), 350);
    return () => clearTimeout(timer);
  }, [introInView]);

  return (
    <section id="team" className="relative w-full bg-black overflow-hidden py-24 sm:py-28">
      {/* Section introduction */}
      <div ref={introRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        {introInView && (
          <BlurText
            text="Meet the Team"
            direction="top"
            delay={60}
            stepDuration={0.4}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          />
        )}

        {showIntroParagraph && (
          <BlurText
            text="Behind every session, event, workshop and achievement is a passionate team working together to build the C3 community."
            direction="top"
            delay={6}
            stepDuration={0.28}
            className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-xl"
          />
        )}
      </div>

      {/* Leadership - constant, 2-up even on the smallest phones */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {LEADERSHIP.map((leader, i) => (
            <LeadershipCard key={leader.role} leader={leader} index={i} />
          ))}
        </div>
      </div>

      {/* Core members - two marquee rows of five, scrolling opposite directions */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={coreHeadingRef}>
          {coreHeadingInView && (
            <BlurText
              text="Core Members"
              direction="top"
              delay={30}
              stepDuration={0.3}
              className="text-xs uppercase tracking-widest text-[#71717A] mb-6"
            />
          )}
        </div>
        <CoreMemberRow members={CORE_ROW_1} direction="left" delayStart={0} />
        <CoreMemberRow members={CORE_ROW_2} direction="right" delayStart={0.15} />
      </div>
    </section>
  );
};

export default TeamSection;