import React from 'react';
import { Calendar, Clock, MapPin, User, Radio } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

const formatTime12h = (time24) => {
  if (!time24 || typeof time24 !== 'string') return '';
  const match = time24.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time24.trim();
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  if (isNaN(hours)) return time24.trim();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const getDisplayTime = (session) => {
  if (session?.startTime) {
    const start = formatTime12h(session.startTime);
    if (session.endTime) {
      return `${start} - ${formatTime12h(session.endTime)}`;
    }
    return start;
  }
  return session?.time ? session.time.trim() : '';
};

const getRelativeEditedTime = (editedAt) => {
  if (!editedAt) return null;
  const editedDate = new Date(editedAt);
  const diffMs = Date.now() - editedDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 0 || diffSec > 86400) return null;
  if (diffSec < 60) return 'Updated just now';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `Updated ${mins} min ago`;
  const hours = Math.floor(mins / 60);
  return `Updated ${hours}h ago`;
};

export const TodaySessionCard = ({ todaySession, upcomingSession }) => {
  const session = todaySession || upcomingSession;

  if (!session) {
    return (
      <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl h-full flex flex-col justify-between">
        <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            Today's Peer Session
          </CardTitle>
          <Badge variant="neutral">None Today</Badge>
        </CardHeader>
        <CardContent className="p-0 pt-6 flex-1 flex items-center justify-center">
          <EmptyState
            icon={Calendar}
            title="No session scheduled today"
            description="There is no peer session scheduled for today. Check back later for announcements."
            className="p-4 sm:p-6 bg-transparent border-0"
          />
        </CardContent>
      </Card>
    );
  }

  const isToday = Boolean(todaySession);
  const isCancelled = session.status === 'cancelled';
  const relativeTag = getRelativeEditedTime(session.editedAt);
  const displayTime = getDisplayTime(session);

  return (
    <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
          <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
            <Radio
              className={`w-4 h-4 ${
                isCancelled
                  ? 'text-red-400'
                  : isToday
                  ? 'text-emerald-400 animate-pulse'
                  : 'text-zinc-400'
              }`}
            />
            {isToday ? "Today's Peer Session" : 'Next Scheduled Session'}
          </CardTitle>

          {isToday ? (
            isCancelled ? (
              <Badge variant="danger">Cancelled</Badge>
            ) : (
              <Badge
                variant="success"
                icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              >
                Live Today
              </Badge>
            )
          ) : isCancelled ? (
            <Badge variant="danger">Cancelled</Badge>
          ) : (
            <Badge variant="neutral">
              Scheduled &bull;{' '}
              {new Date(session.date).toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                month: 'short',
                day: 'numeric',
              })}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-0 pt-4 space-y-3.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span
                className={`text-[10px] font-mono uppercase tracking-wider ${
                  isCancelled ? 'text-red-400' : 'text-zinc-400'
                }`}
              >
                {isToday ? 'Session Topic' : 'Upcoming Topic'}
              </span>
              <h3
                className={`text-lg font-bold text-white mt-0.5 leading-snug ${
                  isCancelled ? 'line-through opacity-75' : ''
                }`}
              >
                {session.topic}
              </h3>
            </div>
            {relativeTag && (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                {relativeTag}
              </span>
            )}
          </div>

          {isCancelled ? (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 leading-relaxed space-y-1">
              <span className="font-semibold text-red-200 block">Session Cancelled</span>
              <span>{session.cancelReason || 'Session cancelled by coordinator.'}</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 truncate">
                  <User className="w-4 h-4 text-zinc-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-mono text-zinc-500 block">Presenter</span>
                    <strong className="text-white truncate block">{session.handledBy}</strong>
                  </div>
                </div>

                {displayTime ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 truncate">
                    <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] font-mono text-zinc-500 block">Time</span>
                      <span className="text-white font-medium truncate block">{displayTime}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {session.venue ? (
                <div className="text-xs text-zinc-400 flex items-center gap-1.5 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{session.venue}</span>
                </div>
              ) : null}

              {session.message ? (
                <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/10 text-xs text-zinc-300 leading-relaxed">
                  {session.message}
                </div>
              ) : null}
            </>
          )}

          {isCancelled && session.handledBy && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 text-xs text-zinc-300">
              <User className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>
                <strong className="text-white">Presenter:</strong> {session.handledBy}
              </span>
            </div>
          )}

          {/* If live today and upcomingSession also exists, show Next Scheduled preview */}
          {todaySession && upcomingSession && (
            <div className="pt-2 text-xs text-zinc-400 flex items-center justify-between border-t border-white/5">
              <span className="text-[11px] font-mono text-zinc-500">Next Scheduled:</span>
              <span className="text-white font-medium truncate max-w-[200px] sm:max-w-[260px]">
                {upcomingSession.topic} (
                {new Date(upcomingSession.date).toLocaleDateString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  month: 'short',
                  day: 'numeric',
                })}
                )
                {upcomingSession.status === 'cancelled' && ' (Cancelled)'}
              </span>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default TodaySessionCard;
