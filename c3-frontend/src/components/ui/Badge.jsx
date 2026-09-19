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
    primary: 'bg-white/10 text-white border-white/20',
    accent: 'bg-white/15 text-white border-white/25',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/10 text-red-400 border-red-500/30',
    neutral: 'bg-zinc-900 text-zinc-400 border-white/10',
    default: 'bg-white/10 text-white border-white/20',
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
