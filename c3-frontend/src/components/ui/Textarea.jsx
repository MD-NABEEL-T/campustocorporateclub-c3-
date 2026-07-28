import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef(
  ({ className, label, error, helperText, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            'w-full bg-[#071A2B]/80 text-[#F8FAFC] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-y',
            error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#EF4444] mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#94A3B8] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
