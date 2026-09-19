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
    primary: 'bg-white/10 text-white border-white/15',
    accent: 'bg-white/10 text-white border-white/15',
    success: 'bg-white/10 text-white border-white/15',
    warning: 'bg-white/10 text-white border-white/15',
  };

  return (
    <Card className={cn('relative overflow-hidden bg-zinc-950/90 border border-white/10', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {title}
          </p>
          <h3 className="text-3xl font-bold font-heading text-white mt-1 tracking-tight">
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
                trend > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              )}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {trendLabel && <span className="text-zinc-400">{trendLabel}</span>}
          {description && <span className="text-zinc-400">{description}</span>}
        </div>
      )}
    </Card>
  );
};
