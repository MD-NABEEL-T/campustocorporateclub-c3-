import React from 'react';
import { SectionContainer } from '../../components/ui/SectionContainer';

export const Gallery = () => {
  return (
    <SectionContainer
      badge="MEDIA GALLERY"
      title="Moments & Activity Archive"
      subtitle="Automatically aggregated photo archives from C3 daily sessions and offline events."
    >
      <div className="text-center text-sm text-[#94A3B8] py-12 border border-dashed border-white/10 rounded-2xl bg-[#10273D]/40">
        Zero-duplicate media gallery aggregation ready for Module 3.
      </div>
    </SectionContainer>
  );
};

export default Gallery;
