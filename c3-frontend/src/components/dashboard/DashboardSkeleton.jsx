import React from 'react';
import { Skeleton } from '../ui/SkeletonLoader';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-3">
        <Skeleton className="h-4 w-28 bg-white/10" />
        <Skeleton className="h-8 w-64 bg-white/10" />
        <Skeleton className="h-4 w-80 bg-white/5" />
      </div>

      {/* 4 Stat Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-24 bg-white/10" />
                <Skeleton className="h-7 w-20 bg-white/10" />
              </div>
              <Skeleton className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
            </div>
            <Skeleton className="h-3 w-36 bg-white/5" />
          </div>
        ))}
      </div>

      {/* Main Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-4 min-h-[260px]">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <Skeleton className="h-5 w-40 bg-white/10" />
            <Skeleton className="h-5 w-20 bg-white/10 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4 bg-white/10" />
          <Skeleton className="h-16 w-full bg-white/5 rounded-xl" />
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-4 min-h-[260px]">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <Skeleton className="h-5 w-36 bg-white/10" />
            <Skeleton className="h-4 w-24 bg-white/10" />
          </div>
          <div className="flex gap-2 pt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 rounded-lg bg-white/10" />
            ))}
          </div>
          <Skeleton className="h-4 w-48 bg-white/5" />
        </div>
      </div>

      {/* Main Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-4 min-h-[240px]"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <Skeleton className="h-5 w-32 bg-white/10" />
              <Skeleton className="h-4 w-16 bg-white/10" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-10 w-full bg-white/5 rounded-xl" />
              <Skeleton className="h-10 w-full bg-white/5 rounded-xl" />
              <Skeleton className="h-10 w-full bg-white/5 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Club Pulse Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-2">
            <Skeleton className="h-3 w-28 bg-white/10" />
            <Skeleton className="h-7 w-16 bg-white/10" />
            <Skeleton className="h-3 w-36 bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
