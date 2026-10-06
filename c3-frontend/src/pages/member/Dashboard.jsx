import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { UserCheck, BookOpen, Calendar, Bell, User, Clock, MapPin, Sparkles } from 'lucide-react';
import axios from '../../api/axios';

export const Dashboard = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [announcements, setAnnouncements] = useState({ todaySession: null, broadcasts: [] });
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (user?._id) {
      axios
        .get(`/attendance/member/${user._id}`)
        .then((res) => {
          if (isMounted) setAttendance(res.data);
        })
        .catch((err) => console.error(err));
    }

    axios
      .get('/announcements')
      .then((res) => {
        if (isMounted) {
          setAnnouncements({
            todaySession: res.data.todaySession || null,
            broadcasts: res.data.broadcasts || [],
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoadingAnnouncements(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const todaySession = announcements.todaySession;
  const broadcasts = announcements.broadcasts;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent border border-white/10 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Welcome Back
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
            Hello, {user?.name || 'Member'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
            Track your peer session attendance, access learning resources, and participate in upcoming C3 events.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Attendance Rate"
          value={attendance ? `${attendance.percentage}%` : '100%'}
          description={attendance ? `${attendance.presentCount} of ${attendance.totalSessions} sessions attended` : 'Loading turnout...'}
          icon={UserCheck}
          color="primary"
        />
        <StatsCard
          title="Daily Sessions"
          value="30 Min"
          description="Active learning sessions"
          icon={BookOpen}
          color="accent"
        />
        <StatsCard
          title="Events Registered"
          value="Active"
          description="Upcoming club workshops"
          icon={Calendar}
          color="success"
        />
        <StatsCard
          title="Announcements"
          value={broadcasts.length > 0 ? `${broadcasts.length} New` : 'Latest'}
          description="Broadcast feed"
          icon={Bell}
          color="warning"
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Today's Peer Session Card */}
        <Card className="bg-zinc-950/90 border border-white/10 flex flex-col justify-between p-5 sm:p-6 shadow-xl">
          <div>
            <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                Today's Peer Session
              </CardTitle>
              {todaySession ? (
                <Badge variant="success">Active Today</Badge>
              ) : (
                <Badge variant="neutral">Upcoming</Badge>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-3">
              {todaySession ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {todaySession.topic}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-400" />
                      <strong className="text-white">Presenter:</strong> {todaySession.handledBy}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {todaySession.time || '4:30 PM - 5:00 PM (30 Mins)'}
                    </span>
                  </div>

                  {todaySession.venue && (
                    <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{todaySession.venue}</span>
                    </div>
                  )}

                  {todaySession.message && (
                    <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 leading-relaxed">
                      {todaySession.message}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <p className="text-sm font-semibold text-white">Daily 30-Minute Peer Session</p>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    Today's presentation session topic and presenter will be updated by coordinators before the slot.
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        </Card>

        {/* Recent Club Broadcasts Card */}
        <Card className="bg-zinc-950/90 border border-white/10 flex flex-col justify-between p-5 sm:p-6 shadow-xl">
          <div>
            <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-white" />
                Recent Club Broadcasts
              </CardTitle>
              <span className="text-xs font-mono text-zinc-500">{broadcasts.length} feeds</span>
            </CardHeader>

            <CardContent className="p-0 pt-3">
              {broadcasts.length > 0 ? (
                <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-1">
                  {broadcasts.map((b) => (
                    <div key={b._id} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-white truncate">{b.title}</p>
                        <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                          {new Date(b.createdAt || b.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{b.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <p className="text-sm font-semibold text-white">Broadcast Channel</p>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    Official club announcements, event alerts, and schedule updates will appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
