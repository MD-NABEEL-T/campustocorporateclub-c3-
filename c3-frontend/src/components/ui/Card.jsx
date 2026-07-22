import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({ className, children, hoverable = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-[#10273D]/90 border border-white/10 rounded-xl p-6 shadow-xl transition-all duration-300',
        hoverable && 'hover:border-[#38BDF8]/40 hover:shadow-2xl hover:shadow-[#38BDF8]/5 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-xl font-bold tracking-tight text-[#F8FAFC]', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-[#94A3B8]', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('flex items-center pt-4 border-t border-white/5 mt-4', className)} {...props}>
    {children}
  </div>
);
