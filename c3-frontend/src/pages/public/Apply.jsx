import React from 'react';
import { SectionContainer } from '../../components/ui/SectionContainer';
import { Card } from '../../components/ui/Card';

export const Apply = () => {
  return (
    <SectionContainer
      badge="RECRUITMENT PORTAL"
      title="Apply for Junior Batch Recruitment"
      subtitle="Join the Campus to Corporate Club. Fill out your details below to submit your application for the upcoming offline interview round."
      centered
    >
      <Card className="max-w-2xl mx-auto text-left p-8">
        <p className="text-sm text-[#94A3B8] mb-4">
          Applications are submitted directly to the C3 Admin Panel. Selected candidates will be notified via email for offline interviews.
        </p>
        <div className="p-6 border border-dashed border-[#38BDF8]/30 rounded-xl bg-[#071A2B]/60 text-center text-[#38BDF8] text-xs font-mono">
          [Recruitment Application Form Component Architecture Prepared]
        </div>
      </Card>
    </SectionContainer>
  );
};

export default Apply;
