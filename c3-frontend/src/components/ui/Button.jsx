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
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold focus:ring-[#3B82F6] shadow-lg shadow-[#3B82F6]/10 hover:shadow-[#3B82F6]/20',
      accent:
        'bg-[#2DD4BF] hover:bg-[#14B8A6] text-black font-semibold focus:ring-[#2DD4BF] shadow-lg shadow-[#2DD4BF]/10',
      secondary:
        'bg-[#111111] hover:bg-[#1A1A1A] text-white border border-white/10 focus:ring-white/20',
      outline:
        'border border-white/15 hover:border-white/30 text-white hover:bg-white/5 focus:ring-white/20',
      ghost:
        'text-[#A1A1AA] hover:text-white hover:bg-white/5 focus:ring-white/20',
      danger:
        'bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold focus:ring-[#EF4444]',
      // Home-page sketch: button 1 - white bg, dark text
      white:
        'bg-white hover:bg-white/90 text-black font-semibold focus:ring-white/40',
      // Home-page sketch: button 2 - glass/gradient dark bg, white text
      glass:
        'bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 text-white border border-white/15 backdrop-blur-md focus:ring-white/20',
      // Navbar: premium blue - gradient fill in the theme's primary blue, for the Member Login CTA
      premiumBlue:
        'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#4B8FF7] hover:to-[#2E6EEF] text-white font-semibold border border-white/10 shadow-lg shadow-[#3B82F6]/25 hover:shadow-[#3B82F6]/40 focus:ring-[#3B82F6]/50',
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