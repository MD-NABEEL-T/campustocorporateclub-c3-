import React from 'react';
import { SectionContainer } from '../../components/ui/SectionContainer';

export const PublicEvents = () => {
  return (
    <SectionContainer
      badge="CLUB EVENTS & WORKSHOPS"
      title="Upcoming Events & Past Reports"
      subtitle="Explore upcoming hackathons, tech workshops, guest sessions, and detailed post-event reports."
    >
      <div className="text-center text-sm text-[#94A3B8] py-12 border border-dashed border-white/10 rounded-2xl bg-[#10273D]/40">
        Public events integration ready for Module 3.
      </div>
    </SectionContainer>
  );
};

export default PublicEvents;
