import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { AdminOverview } from '../../components/dashboard/AdminOverview';
import { UserCheck, BookOpen, Calendar, Bell, User, Clock, MapPin } from 'lucide-react';
import axios from '../../api/axios';

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

export const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/dashboard');
      setDashboardData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.response?.data?.message || 'Failed to connect to dashboard service');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Keep admin strictly on /admin - if admin accesses /dashboard, redirect to /admin
  if (user?.role === 'admin' && location.pathname === '/dashboard') {
    return <Navigate to="/admin" replace />;
  }

  // Render Admin Overview desk if admin
  if (user?.role === 'admin') {
    return (
      <AdminOverview
        data={dashboardData}
        loading={loading}
        error={error}
        onRetry={fetchDashboard}
      />
    );
  }

  // Regular Member View
  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader size="lg" label="Loading your member dashboard..." />
      </div>
    );
  }

  const attendance = dashboardData?.attendance;
  const todaySession = dashboardData?.todaySession;
  const upcomingSession = dashboardData?.upcomingSession;
  const broadcasts = dashboardData?.broadcasts || [];

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
          value={
            attendance?.percentage !== null && attendance?.percentage !== undefined
              ? `${attendance.percentage}%`
              : 'No sessions yet'
          }
          description={
            attendance && attendance.totalSessions > 0
              ? `${attendance.presentCount} of ${attendance.totalSessions} sessions attended`
              : 'No sessions recorded since joining'
          }
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
                {todaySession ? "Today's Peer Session" : (upcomingSession ? "Upcoming Peer Session" : "Today's Peer Session")}
              </CardTitle>
              {todaySession ? (
                todaySession.status === 'cancelled' ? (
                  <Badge variant="danger">Cancelled</Badge>
                ) : (
                  <Badge variant="success">Active Today</Badge>
                )
              ) : upcomingSession ? (
                upcomingSession.status === 'cancelled' ? (
                  <Badge variant="danger">Cancelled</Badge>
                ) : (
                  <Badge variant="neutral">
                    Upcoming &bull; {new Date(upcomingSession.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}
                  </Badge>
                )
              ) : (
                <Badge variant="neutral">Upcoming</Badge>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-3">
              {todaySession || upcomingSession ? (
                (() => {
                  const session = todaySession || upcomingSession;
                  const isCancelled = session.status === 'cancelled';
                  const relativeTag = getRelativeEditedTime(session.editedAt);

                  return (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-lg font-bold text-white leading-snug ${isCancelled ? 'line-through opacity-75' : ''}`}>
                          {session.topic}
                        </h3>
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-zinc-400" />
                              <strong className="text-white">Presenter:</strong> {session.handledBy}
                            </span>
                            {session.time && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                <span>{session.time}</span>
                              </span>
                            )}
                          </div>

                          {session.venue && (
                            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              <span>{session.venue}</span>
                            </div>
                          )}

                          {session.message && (
                            <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 leading-relaxed">
                              {session.message}
                            </div>
                          )}
                        </>
                      )}

                      {isCancelled && (
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span><strong className="text-white">Presenter:</strong> {session.handledBy}</span>
                        </div>
                      )}

                      {todaySession && upcomingSession && (
                        <div className="pt-2 text-xs text-zinc-400 flex items-center justify-between border-t border-white/5">
                          <span className="text-[11px] font-mono text-zinc-500">Next Scheduled:</span>
                          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-[260px]">
                            {upcomingSession.topic} ({new Date(upcomingSession.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })})
                            {upcomingSession.status === 'cancelled' && ' (Cancelled)'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()
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
