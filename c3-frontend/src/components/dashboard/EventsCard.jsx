import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Tag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const EventsCard = ({ events }) => {
  const upcoming = events?.upcoming || [];
  const recent = events?.recent || [];
  const isUpcoming = upcoming.length > 0;
  const displayEvents = isUpcoming ? upcoming : recent;

  return (
    <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white" />
              Club Events
            </CardTitle>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {isUpcoming ? 'Upcoming workshops & competitions' : 'Recent club events archive'}
            </p>
          </div>

          <span className="text-[11px] font-mono text-zinc-500">
            {isUpcoming ? `${upcoming.length} upcoming` : `${recent.length} recent`}
          </span>
        </CardHeader>

        <CardContent className="p-0 pt-3">
          {displayEvents.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No events scheduled"
              description="New workshops, technical hackathons, and guest talks will appear here."
              className="p-4 sm:p-6 bg-transparent border-0"
            />
          ) : (
            <div className="divide-y divide-white/5">
              {displayEvents.map((evt) => (
                <Link
                  key={evt._id}
                  to={`/events/${evt.slug || evt._id}`}
                  className="py-3 block group hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {evt.coverImage ? (
                      <img
                        src={evt.coverImage}
                        alt={evt.title}
                        className="w-12 h-12 rounded-lg object-cover bg-white/5 border border-white/10 shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-zinc-200 truncate">
                        {evt.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-1">
                        <span className="font-mono text-zinc-500">
                          {formatDate(evt.date)}
                        </span>
                        {evt.category && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/10 truncate max-w-[120px]">
                            {evt.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default EventsCard;
