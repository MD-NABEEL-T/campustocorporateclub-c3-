import React, { useState, useCallback } from 'react';
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
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState([]);

    const handleClick = useCallback(
      e => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const id = Date.now();
        const ripple = {
          id,
          size,
          x: e.clientX - rect.left - size / 2,
          y: e.clientY - rect.top - size / 2,
        };
        setRipples(prev => [...prev, ripple]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id));
        }, 600);

        onClick?.(e);
      },
      [onClick]
    );

    const baseStyles =
      'relative overflow-hidden inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-white hover:bg-zinc-200 text-black font-bold focus:ring-white/40 shadow-lg shadow-white/5',
      accent:
        'bg-zinc-100 hover:bg-white text-black font-bold focus:ring-white/20',
      secondary:
        'bg-zinc-900 hover:bg-zinc-800 text-white border border-white/10 focus:ring-white/20',
      outline:
        'border border-white/20 hover:border-white/40 text-white hover:bg-white/10 focus:ring-white/20',
      ghost:
        'text-zinc-400 hover:text-white hover:bg-white/5 focus:ring-white/20',
      danger:
        'bg-red-600 hover:bg-red-500 text-white font-semibold focus:ring-red-500',
      white:
        'bg-white hover:bg-zinc-200 text-black font-bold focus:ring-white/40',
      glass:
        'bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md focus:ring-white/20',
      premiumBlue:
        'bg-white hover:bg-zinc-200 text-black font-bold border border-white/20 shadow-lg focus:ring-white/50',
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
        onClick={handleClick}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {ripples.map(r => (
          <span
            key={r.id}
            className="btn-ripple-span"
            style={{ width: r.size, height: r.size, left: r.x, top: r.y }}
          />
        ))}
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