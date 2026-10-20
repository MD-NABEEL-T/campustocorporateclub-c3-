import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, User, Calendar } from 'lucide-react';
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

export const RecentSessions = ({ recentSessions = [] }) => {
  return (
    <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-white" />
              Recent Peer Sessions
            </CardTitle>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Held club sessions & your participation
            </p>
          </div>

          <Link
            to="/sessions"
            className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors shrink-0 group"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>

        <CardContent className="p-0 pt-3">
          {recentSessions.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No sessions held yet"
              description="Conducted daily peer sessions will be catalogued here."
              className="p-4 sm:p-6 bg-transparent border-0"
            />
          ) : (
            <div className="divide-y divide-white/5">
              {recentSessions.map((session) => (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}`}
                  className="py-3 block group hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-zinc-200 truncate">
                        {session.topic}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-zinc-500" />
                          <span className="truncate">{session.handledBy}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono text-zinc-500">
                          <Calendar className="w-3 h-3" />
                          {formatDate(session.date)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      {session.myStatus === 'present' ? (
                        <Badge variant="success">Present</Badge>
                      ) : session.myStatus === 'absent' ? (
                        <Badge variant="danger">Absent</Badge>
                      ) : (
                        <Badge variant="neutral">Not Joined</Badge>
                      )}
                    </div>
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

export default RecentSessions;
