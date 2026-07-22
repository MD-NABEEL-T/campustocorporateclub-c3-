import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Terminal,
  BookOpen,
  Users,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  Code,
  Cloud,
  Cpu,
  Shield,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Hero from '../../components/Hero/Hero';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/ui/StatsCard';
import { fadeInUp, staggerContainer } from '../../utils/animations';

export const Home = () => {
  return (
    <div className="space-y-0">
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Mission Statement & Tagline Banner */}
      <section className="border-y border-white/10 bg-[#050E18] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8]">
              OUR GUIDING MISSION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F8FAFC]">
              Learn. Build. Collaborate. Lead. Grow.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary">Peer-to-Peer Training</Badge>
            <Badge variant="accent">Placement Preparation</Badge>
            <Badge variant="success">Daily Execution</Badge>
          </div>
        </div>
      </section>

      {/* 3. Why C3 / Core Philosophy */}
      <SectionContainer
        id="why-c3"
        badge="THE C3 PHILOSOPHY"
        title="Why Campus to Corporate Exists"
        subtitle="Addressing the fundamental gap between traditional academic curricula and industry engineering expectations."
        centered
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
        >
          {/* Traditional Clubs Pain Point */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full border-[#EF4444]/20 bg-[#10273D]/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444]/5 rounded-full blur-2xl pointer-events-none" />
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#EF4444]/10 text-[#EF4444]">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <Badge variant="danger">Traditional College Clubs</Badge>
                </div>
                <CardTitle className="text-xl">The Fest-Only Pain Point</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#94A3B8] leading-relaxed">
                <p>
                  Most college clubs operate primarily during annual college cultural or technical fests. Beyond event week, active peer learning drops to zero.
                </p>
                <ul className="space-y-2 pt-2 border-t border-white/5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444] font-bold">✕</span> Sporadic events with no daily consistency
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444] font-bold">✕</span> Scattered, unorganized learning resources
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#EF4444] font-bold">✕</span> Lack of peer presentation accountability
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* C3 Solution */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full border-[#38BDF8]/30 bg-[#10273D] relative overflow-hidden shadow-2xl shadow-[#38BDF8]/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/10 rounded-full blur-2xl pointer-events-none" />
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-[#38BDF8]/10 text-[#38BDF8]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <Badge variant="primary">The C3 Model</Badge>
                </div>
                <CardTitle className="text-xl">Daily 15-Minute Engine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-[#94A3B8] leading-relaxed">
                <p>
                  C3 runs on a mandatory daily 15-minute presentation engine where every member gets the stage to present, teach, and hone public speaking skills.
                </p>
                <ul className="space-y-2 pt-2 border-t border-white/5">
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">✓</span> Daily sessions proving active community momentum
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">✓</span> Centralized member resource hub & DSA roadmaps
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#22C55E] font-bold">✓</span> Learn by teaching & corporate placement prep
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </SectionContainer>

      {/* 4. Live Statistics & Metrics Counter */}
      <SectionContainer
        id="stats"
        badge="CLUB IMPACT METRICS"
        title="Active Community by the Numbers"
        subtitle="Empirical proof of daily execution, attendance metrics, and peer growth."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Daily Sessions Logged"
            value="120+"
            description="15-minute presentations run"
            icon={BookOpen}
            color="primary"
          />
          <StatsCard
            title="Active Members"
            value="60+"
            description="Engineers in daily training"
            icon={Users}
            color="accent"
          />
          <StatsCard
            title="Peer Training Hours"
            value="350+"
            description="Hours of peer teaching"
            icon={Clock}
            color="success"
          />
          <StatsCard
            title="Offline Tech Events"
            value="15+"
            description="Workshops & hackathons"
            icon={Award}
            color="warning"
          />
        </div>
      </SectionContainer>

      {/* 5. Core Domains Showcase */}
      <SectionContainer
        id="domains"
        badge="LEARNING TRACKS"
        title="Technical & Non-Technical Domains"
        subtitle="Master in-demand engineering tracks guided by senior student coordinators."
        centered
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Domain 1 */}
          <Card hoverable className="space-y-4">
            <div className="p-3 w-fit rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">Full-Stack Web Dev</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                React, Node.js, Express, MongoDB, REST APIs, System Architecture, and cloud deployment pipelines.
              </p>
            </div>
            <Badge variant="primary">Technical Track</Badge>
          </Card>

          {/* Domain 2 */}
          <Card hoverable className="space-y-4">
            <div className="p-3 w-fit rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">Cloud & DevOps</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Docker containerization, CI/CD pipelines, AWS fundamentals, Linux system administration, and deployment.
              </p>
            </div>
            <Badge variant="accent">Technical Track</Badge>
          </Card>

          {/* Domain 3 */}
          <Card hoverable className="space-y-4">
            <div className="p-3 w-fit rounded-xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">AI & Machine Learning</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Python data processing, Neural Networks, PyTorch, Model Fine-Tuning, and practical AI application integration.
              </p>
            </div>
            <Badge variant="success">Technical Track</Badge>
          </Card>

          {/* Domain 4 */}
          <Card hoverable className="space-y-4">
            <div className="p-3 w-fit rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">Cybersecurity & Networks</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Network protocols, OWASP Web Security, Ethical Hacking basics, Cryptography, and Security Auditing.
              </p>
            </div>
            <Badge variant="warning">Technical Track</Badge>
          </Card>

          {/* Domain 5 */}
          <Card hoverable className="space-y-4 col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="p-3 w-fit rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">Public Speaking & Corporate Communication</h3>
              <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Overcoming stage fear, technical presentation delivery, mock interview communication, and corporate etiquette training.
              </p>
            </div>
            <Badge variant="primary">Non-Technical Track</Badge>
          </Card>
        </div>
      </SectionContainer>

      {/* 6. About C3 Origin Story Teaser */}
      <SectionContainer
        id="about-teaser"
        badge="ABOUT US"
        title="Bridging the Academic-to-Corporate Gap"
        subtitle="Learn more about how C3 was established to empower students with industry-relevant software skills."
      >
        <Card className="p-8 md:p-12 bg-gradient-to-r from-[#10273D] to-[#071A2B] border border-white/10 relative overflow-hidden text-left">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8]">
              THE ORIGIN STORY
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F8FAFC]">
              "The best way to master software engineering is to teach it to your peers."
            </h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Campus to Corporate (C3) was founded with a singular conviction: textbook engineering education must be complemented by real hands-on building, daily presentation discipline, and honest placement preparation.
            </p>
            <div className="pt-4">
              <Link to="/about">
                <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Read Full About Story
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </SectionContainer>

      {/* 7. Junior Recruitment CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#050E18] border-t border-white/10 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2DD4BF]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <Badge variant="accent" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Recruitment Batch Open
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-[#F8FAFC] tracking-tight">
            Ready to Join the C3 Tech Community?
          </h2>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl mx-auto leading-relaxed font-sans">
            Apply today for the junior batch recruitment. Applications are evaluated by senior coordinators followed by offline interviews.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/apply">
              <Button variant="accent" size="lg" className="w-full sm:w-auto shadow-2xl shadow-[#2DD4BF]/20" leftIcon={<Sparkles className="w-5 h-5" />}>
                Submit Application at /apply
              </Button>
            </Link>
            <Link to="/sessions-archive">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                View Daily Session Log
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
