import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';

export const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendLabel,
  color = 'primary',
  className,
}) => {
  const iconColors = {
    primary: 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20',
    accent: 'bg-[#2DD4BF]/10 text-[#2DD4BF] border-[#2DD4BF]/20',
    success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            {title}
          </p>
          <h3 className="text-3xl font-bold font-heading text-[#F8FAFC] mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={cn('p-3 rounded-xl border', iconColors[color])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="flex items-center gap-2 mt-4 text-xs">
          {trend && (
            <span
              className={cn(
                'font-mono font-medium px-1.5 py-0.5 rounded',
                trend > 0 ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#EF4444]/10 text-[#EF4444]'
              )}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {trendLabel && <span className="text-[#94A3B8]">{trendLabel}</span>}
          {description && <span className="text-[#94A3B8]">{description}</span>}
        </div>
      )}
    </Card>
  );
};
