import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { User } from 'lucide-react';
import BlurText from '../BlurText';

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

const CORE_DOMAINS = [
  {
    title: 'Design & Development',
    accent: '#2DD4BF',
    members: [
      { name: 'Core Member One', tier: 'Senior Core Member' },
      { name: 'Core Member Two', tier: 'Core Member' },
      { name: 'Core Member Three', tier: 'Core Member' }
    ]
  },
  {
    title: 'AI & ML',
    accent: '#818CF8',
    members: [
      { name: 'Core Member Four', tier: 'Senior Core Member' },
      { name: 'Core Member Five', tier: 'Core Member' }
    ]
  },
  {
    title: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    members: [
      { name: 'Core Member Six', tier: 'Senior Core Member' },
      { name: 'Core Member Seven', tier: 'Core Member' },
      { name: 'Core Member Eight', tier: 'Core Member' }
    ]
  },
  {
    title: 'Data Analytics',
    accent: '#F59E0B',
    members: [
      { name: 'Core Member Nine', tier: 'Senior Core Member' },
      { name: 'Core Member Ten', tier: 'Core Member' }
    ]
  },
  {
    title: 'Communication Skills',
    accent: '#FB7185',
    members: [
      { name: 'Core Member Eleven', tier: 'Senior Core Member' },
      { name: 'Core Member Twelve', tier: 'Core Member' }
    ]
  }
];

const PhotoPlaceholder = ({ accent, className = '' }) => (
  <div
    className={`relative w-full overflow-hidden rounded-2xl border ${className}`}
    style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}33` }}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <User className="w-10 h-10" style={{ color: `${accent}55` }} />
    </div>
  </div>
);

const LeadershipCard = ({ leader, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
  >
    <Link
      to={`/team/${slugify(leader.name)}`}
      className="group block rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_16px_50px_rgba(0,0,0,0.45)]"
    >
      <div className="overflow-hidden rounded-2xl mb-5">
        <div className="transition-transform duration-500 group-hover:scale-105">
          <PhotoPlaceholder accent={leader.accent} className="aspect-[4/5]" />
        </div>
      </div>

      <p
        className="text-xs font-semibold uppercase tracking-wide mb-1"
        style={{ color: leader.accent }}
      >
        {leader.role}
      </p>
      <h4 className="font-display text-xl font-bold text-white mb-1">{leader.name}</h4>
      <p className="text-xs text-[#71717A] mb-3">{leader.domain}</p>
      <p className="text-sm text-[#A1A1AA] italic leading-relaxed">"{leader.quote}"</p>
    </Link>
  </motion.div>
);

const CoreMemberCard = ({ member, accent, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
  >
    <Link
      to={`/team/${slugify(member.name)}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.02] p-3 transition-all duration-400 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.05] hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
    >
      <div className="overflow-hidden rounded-xl mb-3">
        <div className="transition-transform duration-500 group-hover:scale-105">
          <PhotoPlaceholder accent={accent} className="aspect-square" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
        <p className="text-sm font-medium text-white truncate">{member.name}</p>
      </div>
      <p className="text-[11px] text-[#71717A] pl-3">{member.tier}</p>
    </Link>
  </motion.div>
);

const DomainGroup = ({ domain }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className="mb-14 last:mb-0">
      {inView && (
        <BlurText
          text={domain.title}
          direction="top"
          delay={30}
          stepDuration={0.35}
          className="font-display text-2xl sm:text-3xl font-bold text-white mb-6"
        />
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {domain.members.map((member, i) => (
          <CoreMemberCard key={member.name} member={member} accent={domain.accent} index={i} />
        ))}
      </div>
    </div>
  );
};

export const TeamSection = () => {
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, amount: 0.4 });
  const [showIntroParagraph, setShowIntroParagraph] = useState(false);

  useEffect(() => {
    if (!introInView) return;
    const timer = setTimeout(() => setShowIntroParagraph(true), 350);
    return () => clearTimeout(timer);
  }, [introInView]);

  return (
    <section id="team" className="relative w-full bg-black overflow-hidden py-24 sm:py-28">
      {/* Section introduction */}
      <div ref={introRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
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

      {/* Leadership */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEADERSHIP.map((leader, i) => (
            <LeadershipCard key={leader.role} leader={leader} index={i} />
          ))}
        </div>
      </div>

      {/* Core members grouped by domain */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-widest text-[#71717A] mb-10">Core Members</p>
        {CORE_DOMAINS.map(domain => (
          <DomainGroup key={domain.title} domain={domain} />
        ))}
      </div>
    </section>
  );
};

export default TeamSection;