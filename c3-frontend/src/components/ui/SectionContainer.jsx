import React from 'react';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

export const SectionContainer = ({
  id,
  badge,
  title,
  subtitle,
  children,
  className,
  headerClassName,
  centered = false,
}) => {
  return (
    <section id={id} className={cn('py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto', className)}>
      {(badge || title || subtitle) && (
        <div
          className={cn(
            'mb-12 space-y-3',
            centered && 'text-center max-w-2xl mx-auto',
            headerClassName
          )}
        >
          {badge && <Badge variant="primary">{badge}</Badge>}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#F8FAFC] tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};
