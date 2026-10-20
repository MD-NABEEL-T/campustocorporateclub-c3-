import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

const getRelativeTime = (timestamp) => {
  if (!timestamp) return '—';
  const diff = Date.now() - new Date(timestamp).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

export const BroadcastsCard = ({ broadcasts = [] }) => {
  return (
    <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-white" />
              Latest Broadcasts
            </CardTitle>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Official announcements from coordinators
            </p>
          </div>

          <span className="text-[11px] font-mono text-zinc-500">
            {broadcasts.length} {broadcasts.length === 1 ? 'feed' : 'feeds'}
          </span>
        </CardHeader>

        <CardContent className="p-0 pt-2">
          {broadcasts.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No broadcasts published"
              description="Official club notices, schedule updates, and alerts will appear here."
              className="p-4 sm:p-6 bg-transparent border-0"
            />
          ) : (
            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto pr-1">
              {broadcasts.map((b) => (
                <div key={b._id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">
                      {b.title}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {getRelativeTime(b.createdAt || b.date)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {b.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default BroadcastsCard;
