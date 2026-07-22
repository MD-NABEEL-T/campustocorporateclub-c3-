import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#071A2B] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#38BDF8] hover:bg-[#0284C7] text-[#071A2B] font-semibold focus:ring-[#38BDF8] shadow-lg shadow-[#38BDF8]/10 hover:shadow-[#38BDF8]/20',
      accent:
        'bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#071A2B] font-semibold focus:ring-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/10',
      secondary:
        'bg-[#10273D] hover:bg-[#16324F] text-[#F8FAFC] border border-white/10 focus:ring-[#38BDF8]',
      outline:
        'border border-[#38BDF8]/40 hover:border-[#38BDF8] text-[#38BDF8] hover:bg-[#38BDF8]/10 focus:ring-[#38BDF8]',
      ghost:
        'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 focus:ring-white/20',
      danger:
        'bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold focus:ring-[#EF4444]',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
