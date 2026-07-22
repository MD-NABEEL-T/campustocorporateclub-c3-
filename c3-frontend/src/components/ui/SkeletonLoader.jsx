import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-white/5 border border-white/5',
        className
      )}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-[#10273D] border border-white/10 rounded-xl p-6 space-y-4 animate-pulse">
    <div className="h-4 bg-white/10 rounded w-1/3" />
    <div className="h-8 bg-white/10 rounded w-2/3" />
    <div className="h-16 bg-white/5 rounded w-full" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full bg-[#10273D] border border-white/10 rounded-xl p-4 space-y-3 animate-pulse">
    <div className="h-6 bg-white/10 rounded w-full mb-4" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-10 bg-white/5 rounded w-full flex items-center justify-between px-4">
        <div className="h-4 bg-white/10 rounded w-1/4" />
        <div className="h-4 bg-white/10 rounded w-1/3" />
        <div className="h-4 bg-white/10 rounded w-1/6" />
      </div>
    ))}
  </div>
);
