import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { User, RotateCw, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import BlurText from '../reactbits/BlurText';
import Marquee from '../reactbits/Marquee';
import FlipCard from '../reactbits/FlipCard';

// Mock data only - photos, names, quotes and socials are placeholders.
const LEADERSHIP = [
  {
    name: 'Member Name',
    role: 'President',
    domain: 'Design & Development',
    accent: '#2DD4BF',
    quote: 'C3 taught me that leading means teaching, not just doing.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Member Name',
    role: 'Vice President',
    domain: 'AI & ML',
    accent: '#818CF8',
    quote: 'Every session is a chance to learn alongside the people we teach.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Member Name',
    role: 'Session Handler',
    domain: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    quote: 'Good sessions come from good questions, not just good slides.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Member Name',
    role: 'Event Manager',
    domain: 'Data Analytics',
    accent: '#F59E0B',
    quote: 'An event is just a team working well together, in public.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  }
];

// 9 core members, split into three rows of 3 for the marquee.
const CORE_MEMBERS = [
  {
    name: 'Core Member One',
    tier: 'Senior Core Member',
    domain: 'Design & Development',
    accent: '#2DD4BF',
    quote: 'Every pixel matters when you\u2019re building for people you know.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Core Member Two',
    tier: 'Core Member',
    domain: 'AI & ML',
    accent: '#818CF8',
    quote: 'Curiosity got me here, the club kept me around.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Core Member Three',
    tier: 'Senior Core Member',
    domain: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    quote: 'Security is a mindset before it\u2019s a skillset.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Core Member Four',
    tier: 'Core Member',
    domain: 'Data Analytics',
    accent: '#F59E0B',
    quote: 'Excel first, Python next, dashboards forever.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Core Member Five',
    tier: 'Senior Core Member',
    domain: 'Communication Skills',
    accent: '#FB7185',
    quote: 'Confidence is just practice wearing a good outfit.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Core Member Six',
    tier: 'Core Member',
    domain: 'Design & Development',
    accent: '#2DD4BF',
    quote: 'I learned React by breaking things here first.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Core Member Seven',
    tier: 'Core Member',
    domain: 'AI & ML',
    accent: '#818CF8',
    quote: 'Models are easy. Explaining them well is the real skill.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Core Member Eight',
    tier: 'Core Member',
    domain: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    quote: 'My first Wireshark capture broke my brain, in a good way.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  },
  {
    name: 'Core Member Nine',
    tier: 'Core Member',
    domain: 'Data Analytics',
    accent: '#F59E0B',
    quote: 'Data tells a story if you\u2019re patient enough to listen.',
    socials: { email: 'mailto:member@c3club.dev', github: 'https://github.com', linkedin: 'https://linkedin.com' }
  }
];
const CORE_ROW_1 = CORE_MEMBERS.slice(0, 3);
const CORE_ROW_2 = CORE_MEMBERS.slice(3, 6);
const CORE_ROW_3 = CORE_MEMBERS.slice(6, 9);

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

const SocialRow = ({ socials, accent, size = 'sm' }) => {
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const btnClass = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';

  const links = [
    { key: 'email', href: socials.email, Icon: Mail },
    { key: 'github', href: socials.github, Icon: FaGithub },
    { key: 'linkedin', href: socials.linkedin, Icon: FaLinkedin }
  ];

  return (
    <div className="flex items-center gap-2">
      {links.map(({ key, href, Icon }) => (
        <a
          key={key}
          href={href}
          target={key === 'email' ? undefined : '_blank'}
          rel={key === 'email' ? undefined : 'noreferrer'}
          onClick={e => e.stopPropagation()}
          className={`${btnClass} rounded-full flex items-center justify-center border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors`}
          style={{ '--tw-ring-color': accent }}
        >
          <Icon className={iconClass} />
        </a>
      ))}
    </div>
  );
};

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
          <SocialRow socials={leader.socials} accent={leader.accent} size="md" />
        </div>
      }
    />
  </motion.div>
);

const CoreMemberCard = ({ member }) => (
  <FlipCard
    className="w-[172px] h-[230px] sm:w-[190px] sm:h-[250px] shrink-0"
    front={
      <div className="relative w-full h-full rounded-xl border border-white/10 bg-white/[0.02] p-3 flex flex-col">
        <FlipHint accent={member.accent} />
        <PhotoPlaceholder accent={member.accent} className="aspect-square mb-2.5" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: member.accent }} />
          <p className="text-xs font-medium text-white truncate">{member.name}</p>
        </div>
        <p className="text-[10px] text-[#71717A] pl-3 truncate">{member.tier}</p>
      </div>
    }
    back={
      <div className="relative w-full h-full rounded-xl border border-white/10 bg-[#0a0a0a] p-3 flex flex-col justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: member.accent }}>
            {member.tier}
          </p>
          <p className="text-[10px] text-[#71717A] mb-2">{member.domain}</p>
          <p className="text-[11px] text-[#D4D4D8] italic leading-snug line-clamp-4">"{member.quote}"</p>
        </div>
        <SocialRow socials={member.socials} accent={member.accent} size="sm" />
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
      <Marquee direction={direction} speed={30}>
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
    <section id="team" className="relative w-full bg-black overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20">
      {/* Section introduction */}
      <div ref={introRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-14">
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {LEADERSHIP.map((leader, i) => (
            <LeadershipCard key={leader.role} leader={leader} index={i} />
          ))}
        </div>
      </div>

      {/* Core members - three marquee rows of three, alternating directions */}
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
        <CoreMemberRow members={CORE_ROW_3} direction="left" delayStart={0.3} />
      </div>
    </section>
  );
};

export default TeamSection;