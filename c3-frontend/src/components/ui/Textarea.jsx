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
            'w-full bg-zinc-900/90 text-white border border-white/10 rounded-xl px-3.5 py-2.5 text-sm placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-y',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
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
