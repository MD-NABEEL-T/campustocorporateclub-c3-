import React from 'react';
import { SectionContainer } from '../../components/ui/SectionContainer';

export const PublicSessions = () => {
  return (
    <SectionContainer
      badge="DAILY SESSIONS ARCHIVE"
      title="Public Log of Daily Peer Presentations"
      subtitle="Examine our live archive of daily 15-minute technical and non-technical presentations conducted by C3 members."
    >
      <div className="text-center text-sm text-[#94A3B8] py-12 border border-dashed border-white/10 rounded-2xl bg-[#10273D]/40">
        Public session log integration ready for Module 3.
      </div>
    </SectionContainer>
  );
};

export default PublicSessions;
