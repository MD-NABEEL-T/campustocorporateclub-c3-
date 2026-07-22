import React from 'react';
import { cn } from '../../utils/cn';

export const Loader = ({ size = 'md', label = 'Loading...', fullScreen = false, className }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'border-[#38BDF8] border-t-transparent rounded-full animate-spin',
          sizes[size]
        )}
      />
      {label && <p className="text-xs font-mono text-[#94A3B8]">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071A2B]/90 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
};
