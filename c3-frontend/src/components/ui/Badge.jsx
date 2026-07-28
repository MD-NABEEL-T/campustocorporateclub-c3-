import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  className,
  variant = 'primary',
  children,
  icon,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30',
    accent: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/30',
    success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
    neutral: 'bg-white/5 text-[#94A3B8] border-white/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border font-mono tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
