import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Terminal,
  BookOpen,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { fadeInUp, staggerContainer } from '../../utils/animations';

export const About = () => {
  return (
    <div className="py-12 space-y-16">
      {/* 1. Header Banner */}
      <SectionContainer
        badge="ABOUT CAMPUS TO CORPORATE"
        title="Bridging Academic Learning to Corporate Excellence"
        subtitle="Campus to Corporate (C3) is a student-led technical club inside college dedicated to transforming aspiring learners into placement-ready software engineers."
        centered
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
          <Card hoverable className="space-y-2">
            <Badge variant="primary">Origin</Badge>
            <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">Founded by Students</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Established by senior CSE students who recognized that college curriculum alone needs practical, peer-driven software engineering practice.
            </p>
          </Card>

          <Card hoverable className="space-y-2">
            <Badge variant="accent">Culture</Badge>
            <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">Learn by Teaching</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Every member gets the platform to present technical concepts. Teaching peers enforces deep personal mastery.
            </p>
          </Card>

          <Card hoverable className="space-y-2">
            <Badge variant="success">Consistency</Badge>
            <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">Daily Execution</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Unlike clubs active only during annual fests, C3 operates a daily 15-minute presentation engine year-round.
            </p>
          </Card>
        </div>
      </SectionContainer>

      {/* 2. Core Pillars */}
      <SectionContainer
        id="pillars"
        badge="THE 4 CORE PILLARS"
        title="Our Foundation & Values"
        subtitle="The four foundational principles driving every session, workshop, and application evaluation."
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
        >
          {/* Pillar 1 */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">1. Learn by Teaching</h3>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Presenting a topic to 50+ peers forces you to truly understand it. From Data Structures to Cloud Architecture, members present daily to sharpen technical mastery.
              </p>
            </Card>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#2DD4BF]/10 text-[#2DD4BF] border border-[#2DD4BF]/20">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">2. Peer Accountability</h3>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Consistency is hard alone. At C3, member attendance and presentations are tracked, celebrated, and supported by domain coordinators.
              </p>
            </Card>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">3. Corporate Placement Prep</h3>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                We prepare members for real technical interviews: Aptitude drills, DSA problem-solving, System Design reviews, and mock interview practice.
              </p>
            </Card>
          </motion.div>

          {/* Pillar 4 */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold font-heading text-[#F8FAFC]">4. Practical Hands-On Building</h3>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                No slide-only theories. Members build real full-stack software applications, participate in national hackathons (DevHouse, IDC Nexus), and deploy real code.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </SectionContainer>

      {/* 3. CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 md:p-12 bg-gradient-to-r from-[#10273D] to-[#050E18] border border-white/10 text-center space-y-6">
          <Badge variant="accent" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Junior Recruitment Open
          </Badge>
          <h2 className="text-3xl font-extrabold font-heading text-[#F8FAFC] max-w-2xl mx-auto">
            Become Part of the Next C3 Member Cohort
          </h2>
          <p className="text-sm text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            Fill out your recruitment application form today. Selected candidates will be invited for offline interview rounds with club coordinators.
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/apply">
              <Button variant="accent" size="lg" leftIcon={<Sparkles className="w-5 h-5" />}>
                Apply Now at /apply
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default About;
