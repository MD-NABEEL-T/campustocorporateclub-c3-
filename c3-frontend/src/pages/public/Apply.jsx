import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Award,
  BookOpen,
  Network,
  GraduationCap,
  CheckCircle2,
  FileText,
  MessageCircle,
  UserCheck,
  Mail,
} from 'lucide-react';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ApplicationForm } from '../../components/public/ApplicationForm';
import { FAQAccordion } from '../../components/public/FAQAccordion';
import { DOMAINS } from '../../constants/domains';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const BENEFITS = [
  {
    icon: BookOpen,
    color: 'primary',
    title: 'Daily Peer Learning',
    description: 'Present and learn from 15-minute daily sessions covering real engineering topics.',
  },
  {
    icon: Award,
    color: 'accent',
    title: 'Placement Preparation',
    description: 'Aptitude drills, DSA problem-solving, system design reviews, and mock interviews.',
  },
  {
    icon: Network,
    color: 'success',
    title: 'Peer Network',
    description: 'Connect with senior coordinators and driven peers across multiple engineering domains.',
  },
  {
    icon: GraduationCap,
    color: 'warning',
    title: 'Hands-on Building',
    description: 'Ship real full-stack projects and participate in hackathons like DevHouse and IDC Nexus.',
  },
];

const ELIGIBILITY = [
  'Currently enrolled as a full-time student in the college',
  'Genuine interest in at least one technical or non-technical domain',
  'Willingness to commit to daily 15-minute presentation sessions',
  'No prior experience required - only consistency and willingness to learn',
];

const TIMELINE = [
  {
    icon: FileText,
    title: 'Submit Application',
    description: 'Fill out the recruitment form below with your details and preferred domain.',
  },
  {
    icon: UserCheck,
    title: 'Application Review',
    description: 'Senior coordinators review every application against domain interest and eligibility.',
  },
  {
    icon: MessageCircle,
    title: 'Offline Interview',
    description: 'Shortlisted applicants are invited for a short in-person conversation with coordinators.',
  },
  {
    icon: Mail,
    title: 'Result & Onboarding',
    description: 'Selected candidates are notified via college email and onboarded into their batch.',
  },
];

const FAQS = [
  {
    question: 'Do I need prior coding or public speaking experience to apply?',
    answer:
      'No. C3 is built for learning by doing. We look for consistency and genuine interest in a domain over existing expertise.',
  },
  {
    question: 'How much time does C3 require each week?',
    answer:
      'The core commitment is the daily 15-minute presentation slot, plus occasional workshops and offline events. It is designed to fit around your regular coursework.',
  },
  {
    question: 'Can I apply for more than one domain?',
    answer:
      'Yes. You can select a preferred domain and an optional secondary domain in the application form.',
  },
  {
    question: 'Will I get a club account immediately after applying?',
    answer:
      'No. Submitting this form only creates an application record. Member accounts are created manually by admins after the offline interview round for selected candidates.',
  },
  {
    question: 'How will I know if I am selected?',
    answer:
      'Coordinators reach out via the college email you provide in the application, so make sure it is accurate and actively checked.',
  },
];

const colorMap = {
  primary: { bg: 'bg-[#38BDF8]/10', text: 'text-[#38BDF8]', border: 'border-[#38BDF8]/20' },
  accent: { bg: 'bg-[#2DD4BF]/10', text: 'text-[#2DD4BF]', border: 'border-[#2DD4BF]/20' },
  success: { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]', border: 'border-[#22C55E]/20' },
  warning: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20' },
};

export const Apply = () => {
  return (
    <div className="space-y-0">
      {/* 1. Header + CTA */}
      <SectionContainer
        badge="RECRUITMENT PORTAL"
        title="Join the Campus to Corporate Club"
        subtitle="C3 is the student-led technical club running daily 15-minute peer sessions, hands-on projects, and placement preparation to turn students into corporate-ready engineers."
        centered
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#apply-form">
            <Button variant="accent" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
              Start Your Application
            </Button>
          </a>
          <Badge variant="success">Junior Batch Recruitment Open</Badge>
        </div>
      </SectionContainer>

      {/* 2. Why Join C3 / Benefits */}
      <SectionContainer
        id="benefits"
        badge="WHY JOIN C3"
        title="Benefits of Becoming a Member"
        subtitle="A daily-execution community designed around real engineering growth, not just annual fest activity."
        centered
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
        >
          {BENEFITS.map((benefit) => {
            const colors = colorMap[benefit.color];
            return (
              <motion.div key={benefit.title} variants={fadeInUp}>
                <Card hoverable className="h-full space-y-3">
                  <div className={`p-3 w-fit rounded-xl ${colors.bg} ${colors.text} border ${colors.border}`}>
                    <benefit.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-heading text-[#F8FAFC]">{benefit.title}</h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{benefit.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </SectionContainer>

      {/* 3. Domains Available */}
      <SectionContainer
        id="domains"
        badge="LEARNING TRACKS"
        title="Domains Available"
        subtitle="Pick a preferred domain and, optionally, a secondary domain when you apply."
        centered
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {DOMAINS.map((domain) => {
            const colors = colorMap[domain.color];
            return (
              <Card key={domain.value} hoverable className="space-y-4">
                <div className={`p-3 w-fit rounded-xl ${colors.bg} ${colors.text} border ${colors.border}`}>
                  <domain.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-[#F8FAFC]">{domain.label}</h3>
                  <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">{domain.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </SectionContainer>

      {/* 4. Eligibility */}
      <SectionContainer
        id="eligibility"
        badge="ELIGIBILITY"
        title="Who Can Apply"
        subtitle="C3 is open to any student ready to commit to daily consistency over prior expertise."
        centered
      >
        <Card className="max-w-2xl mx-auto text-left p-8">
          <ul className="space-y-3">
            {ELIGIBILITY.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-[#94A3B8] leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        </Card>
      </SectionContainer>

      {/* 5. Recruitment Process Timeline */}
      <SectionContainer
        id="timeline"
        badge="RECRUITMENT PROCESS"
        title="What Happens After You Apply"
        subtitle="A straightforward four-step process from application to onboarding."
        centered
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
        >
          {TIMELINE.map((step, index) => (
            <motion.div key={step.title} variants={fadeInUp}>
              <Card className="h-full space-y-3 relative">
                <span className="absolute top-4 right-4 text-xs font-mono text-[#94A3B8]">
                  0{index + 1}
                </span>
                <div className="p-2.5 w-fit rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-heading text-[#F8FAFC]">{step.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </SectionContainer>

      {/* 6. FAQ */}
      <SectionContainer
        id="faq"
        badge="FREQUENTLY ASKED QUESTIONS"
        title="Have Questions?"
        subtitle="Everything you need to know before applying."
        centered
      >
        <FAQAccordion items={FAQS} />
      </SectionContainer>

      {/* 7. Application Form */}
      <SectionContainer
        id="apply-form"
        badge="APPLICATION FORM"
        title="Apply for Junior Batch Recruitment"
        subtitle="Applications are reviewed by senior coordinators. Selected candidates are invited for an offline interview."
        centered
      >
        <ApplicationForm />
      </SectionContainer>
    </div>
  );
};

export default Apply;
