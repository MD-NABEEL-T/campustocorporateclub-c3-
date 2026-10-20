import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';

export const AttendanceTrend = ({ attendance }) => {
  const history = attendance?.history || [];

  return (
    <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl h-full flex flex-col justify-between">
      <div>
        <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Attendance Trend
            </CardTitle>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Recent eligible peer sessions (latest 10)
            </p>
          </div>

          <Link
            to="/attendance"
            className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group shrink-0"
          >
            <span>View full record</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>

        <CardContent className="p-0 pt-5">
          {history.length === 0 ? (
            <EmptyState
              icon={UserCheck}
              title="No attendance records"
              description="No peer sessions have been conducted since your account joined the club."
              className="p-4 sm:p-6 bg-transparent border-0"
            />
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {history.map((s, idx) => {
                  const isPresent = s.status === 'present';
                  const dateStr = s.date
                    ? new Date(s.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—';

                  return (
                    <div
                      key={s._id || idx}
                      tabIndex={0}
                      title={`${dateStr} · ${s.topic} (${isPresent ? 'Present' : 'Absent'})`}
                      className={`group relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                        isPresent
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                      }`}
                    >
                      {isPresent ? 'P' : 'A'}

                      {/* Tooltip on hover/focus */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block group-focus:block z-30 pointer-events-none">
                        <div className="p-2.5 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl text-[11px] whitespace-nowrap text-zinc-200 min-w-[160px] max-w-[240px]">
                          <p className="font-semibold text-white truncate">{s.topic}</p>
                          <p className="text-zinc-400 font-mono text-[10px] mt-0.5 flex items-center justify-between gap-2">
                            <span>{dateStr}</span>
                            <span className={isPresent ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                              {isPresent ? 'Present' : 'Absent'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/5 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    Present ({attendance?.presentCount ?? 0})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                    Absent ({attendance?.absentCount ?? 0})
                  </span>
                </div>
                {attendance?.currentStreak > 0 && (
                  <span className="text-amber-400">
                    🔥 {attendance.currentStreak} streak
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default AttendanceTrend;
