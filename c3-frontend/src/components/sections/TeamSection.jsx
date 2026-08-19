import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { User, RotateCw, Mail, Code2 } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import BlurText from '../reactbits/BlurText';
import Marquee from '../reactbits/Marquee';
import FlipCard from '../reactbits/FlipCard';
import PointerHighlight from '../ui/PointerHighlight';

// Real members are marked with `photo` pointing at /assets/team/<file>
// - drop the image there and it displays automatically (falls back to the
// placeholder icon until then). Everyone else here is still mock data
// (name/socials/quote are placeholders) and stays that way until real
// info is provided.
//
// `photoPosition` is a CSS object-position value (e.g. 'center 20%',
// 'center top') used with object-fit: cover so each portrait's crop can
// be tuned per person instead of one setting for everyone. Defaults to
// 'center 20%' (biases toward the head) - nudge individual values once
// you can see how each photo actually crops on the live site.
const LEADERSHIP = [
  {
    name: 'Ashfaq Ahmed. M',
    role: 'President',
    domain: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    quote: null,
    photo: '/assets/team/ashfaq-ahmed-m.jpeg',
    photoPosition: 'center 20%',
    socials: { email: 'mailto:ashfaqashu689@gmail.com', github: null, linkedin: 'https://www.linkedin.com/in/ashfaq-ahmed-m-b3a49a2a5/' }
  },
  {
    name: 'Nabeel',
    role: 'Vice President',
    domain: 'Design & Development',
    accent: '#2DD4BF',
    quote: 'Code . Inspire People . Leave a Legacy .',
    isDeveloper: true, // permanent PointerHighlight on the name + small "</> Developer" pill on the Team card - visual only
    photo: '/assets/team/nabeel.jpeg',
    photoPosition: 'center 20%',
    socials: {
      email: 'mailto:tmdnabeel4656.tmn@gmail.com',
      github: 'https://github.com/MD-NABEEL-T',
      linkedin: 'https://linkedin.com/in/mohammed-nabeel-t'
    }
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

// 8 core members, split into TWO rows of 4 for the marquee (previously
// 3 rows of 3 - trimmed to 2 rows so real members don't feel repeated
// across an extra row). Slots 1-5 hold real members; the remaining 3
// mock members fill out row 2 and stay untouched until real info is
// provided for them. One mock placeholder ("Core Member Nine") was
// dropped to fit the 2-row/8-card layout - it was never real data, so
// nothing real was lost, and there's still room to swap any mock slot
// for a real member later.
const CORE_MEMBERS = [
  {
    name: 'Shareen Begum.Z',
    tier: 'Core Member',
    domain: 'AI/ML',
    accent: '#818CF8',
    quote: 'Stand firm. Think bigger. Deliver better.',
    photo: '/assets/team/shareen-begum-z.png',
    photoPosition: 'center 20%',
    socials: { email: 'mailto:zshareenbegum@gmail.com', github: 'https://github.com/shareenbegum', linkedin: 'https://www.linkedin.com/in/shareen-begum-z-649266379' }
  },
  {
    name: 'Mohamed Riyaz M',
    tier: 'Core Member',
    domain: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    quote: 'Learning today. Leading tomorrow.',
    photo: '/assets/team/mohamed-riyaz-m.jpeg',
    photoPosition: 'center 20%',
    socials: { email: 'mailto:riyazzen.46@gmail.com', github: 'https://github.com/riyaz062', linkedin: 'https://www.linkedin.com/in/mohamed-riyaz-m-42bab7385' }
  },
  {
    name: 'Mohamed Zaid',
    tier: 'Core Member',
    domain: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    quote: 'Driven by curiosity, powered by consistency.',
    photo: '/assets/team/mohamed-zaid.jpeg',
    photoPosition: 'center 20%',
    socials: { email: 'mailto:zaid.offl.007@gmail.com', github: 'https://github.com/Minni-Zaid', linkedin: 'https://www.linkedin.com/in/immohamedzaid' }
  },
  {
    name: 'S Mohammad Saifullah Roomy',
    tier: 'Core Member',
    domain: 'Data Analytics',
    accent: '#F59E0B',
    quote: null,
    photo: '/assets/team/s-mohammad-saifullah-roomy.jpg',
    photoPosition: 'center 20%',
    socials: { email: 'mailto:saifullahroomy129@gmail.com', github: 'https://github.com/roomy129', linkedin: 'https://www.linkedin.com/in/md-saifullah-roomy-s-14a9493a0/' }
  },
  {
    name: 'Mohammed Owais Ansari',
    tier: 'Core Member',
    domain: 'Networking & Cybersecurity',
    accent: '#38BDF8',
    quote: null,
    photo: '/assets/team/mohammed-owais-ansari.png',
    photoPosition: 'center 20%',
    socials: { email: 'mailto:owaisansari1626@gmail.com', github: 'https://github.com/owaisansari1626', linkedin: 'https://www.linkedin.com/in/owaisansari1626' }
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
  }
];
const CORE_ROW_1 = CORE_MEMBERS.slice(0, 4);
const CORE_ROW_2 = CORE_MEMBERS.slice(4, 8);

// Shows the real photo when `photo` is set and loads successfully;
// otherwise falls back to the original icon placeholder unchanged.
const Photo = ({ photo, accent, position = 'center', className = '' }) => {
  const [errored, setErrored] = useState(false);

  if (photo && !errored) {
    return (
      <div className={`relative w-full overflow-hidden rounded-xl border ${className}`} style={{ borderColor: `${accent}33` }}>
        <img
          src={photo}
          alt=""
          loading="lazy"
          onError={() => setErrored(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: position }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border ${className}`}
      style={{ backgroundColor: `${accent}0d`, borderColor: `${accent}33` }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <User className="w-7 h-7" style={{ color: `${accent}55` }} />
      </div>
    </div>
  );
};

const FlipHint = ({ accent }) => (
  <span
    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border"
    style={{ borderColor: `${accent}44` }}
  >
    <RotateCw className="w-3 h-3 text-white/70" />
  </span>
);

const DeveloperBadge = ({ accent }) => (
  <span
    className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-semibold uppercase tracking-wider bg-black/50 backdrop-blur-sm border"
    style={{ borderColor: `${accent}55`, color: accent }}
  >
    <Code2 className="w-2.5 h-2.5" />
    Developer
  </span>
);

const SocialRow = ({ socials, accent, size = 'sm' }) => {
  const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const btnClass = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';

  const links = [
    { key: 'email', href: socials.email, Icon: Mail },
    { key: 'github', href: socials.github, Icon: FaGithub },
    { key: 'linkedin', href: socials.linkedin, Icon: FaLinkedin }
  ].filter(link => link.href);

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
          {leader.isDeveloper && <DeveloperBadge accent={leader.accent} />}
          <FlipHint accent={leader.accent} />
          <Photo photo={leader.photo} accent={leader.accent} position={leader.photoPosition} className="aspect-square mb-2.5" />
          <p
            className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide truncate"
            style={{ color: leader.accent }}
          >
            {leader.role}
          </p>
          {leader.isDeveloper ? (
            <PointerHighlight
              containerClassName="inline-block max-w-full"
              rectangleClassName="border-[#38BDF8]/50"
              pointerClassName="text-[#38BDF8]"
            >
              <h4 className="relative z-10 font-display text-sm sm:text-lg font-bold text-white truncate px-0.5">
                {leader.name}
              </h4>
            </PointerHighlight>
          ) : (
            <h4 className="font-display text-sm sm:text-lg font-bold text-white truncate">{leader.name}</h4>
          )}
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
            {leader.quote && (
              <p className="text-xs sm:text-sm text-[#D4D4D8] italic leading-relaxed line-clamp-4">
                "{leader.quote}"
              </p>
            )}
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
        <Photo photo={member.photo} accent={member.accent} position={member.photoPosition} className="aspect-square mb-2.5" />
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
          {member.quote && (
            <p className="text-[11px] text-[#D4D4D8] italic leading-snug line-clamp-4">"{member.quote}"</p>
          )}
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

      {/* Core members - two marquee rows of four, alternating directions */}
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