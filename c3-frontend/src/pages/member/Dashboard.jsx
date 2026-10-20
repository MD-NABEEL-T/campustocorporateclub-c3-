import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/ui/StatsCard';
import { Button } from '../../components/ui/Button';
import { UserCheck, BookOpen, Calendar, Flame, AlertTriangle } from 'lucide-react';
import axios from '../../api/axios';

import { AdminOverview } from '../../components/dashboard/AdminOverview';
import { TodaySessionCard } from '../../components/dashboard/TodaySessionCard';
import { AttendanceTrend } from '../../components/dashboard/AttendanceTrend';
import { RecentSessions } from '../../components/dashboard/RecentSessions';
import { EventsCard } from '../../components/dashboard/EventsCard';
import { BroadcastsCard } from '../../components/dashboard/BroadcastsCard';
import { ClubPulse } from '../../components/dashboard/ClubPulse';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';

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

  // Regular Member Loading Skeleton
  if (loading) {
    return <DashboardSkeleton />;
  }

  // Error State with Retry
  if (error) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <h3 className="font-semibold text-white text-base">Failed to load member dashboard</h3>
        </div>
        <p className="text-xs sm:text-sm text-red-300/80 leading-relaxed">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboard}
          className="text-xs text-white border-white/20 hover:bg-white/10"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  const name = dashboardData?.me?.name || user?.name || 'Member';
  const attendance = dashboardData?.attendance;
  const eventsCount = dashboardData?.events?.upcoming?.length ?? 0;

  const subline =
    attendance && attendance.totalSessions > 0
      ? `You've attended ${attendance.presentCount} of ${attendance.totalSessions} sessions${
          attendance.currentStreak > 0 ? ` · ${attendance.currentStreak}-session streak` : ''
        }`
      : null;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent border border-white/10 relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
            Member Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
            Hello, {name} 👋
          </h1>
          {subline && (
            <p className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono">
              {subline}
            </p>
          )}
        </div>
      </div>

      {/* Four Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Attendance Rate"
          value={
            attendance?.percentage !== null && attendance?.percentage !== undefined
              ? `${attendance.percentage}%`
              : '—'
          }
          description={
            attendance && attendance.totalSessions > 0
              ? `${attendance.presentCount} of ${attendance.totalSessions} eligible sessions`
              : 'No sessions recorded yet'
          }
          icon={UserCheck}
          color="primary"
        />

        <StatsCard
          title="Sessions Attended"
          value={
            attendance && attendance.totalSessions > 0
              ? `${attendance.presentCount} / ${attendance.totalSessions}`
              : '0 / 0'
          }
          description={
            attendance && attendance.totalSessions > 0
              ? `${attendance.absentCount} missed sessions`
              : 'Since joining club'
          }
          icon={BookOpen}
          color="accent"
        />

        <StatsCard
          title="Current Streak"
          value={`${attendance?.currentStreak ?? 0} ${
            (attendance?.currentStreak ?? 0) === 1 ? 'session' : 'sessions'
          }`}
          description={
            (attendance?.currentStreak ?? 0) > 0
              ? 'Consecutive attendances'
              : 'Attend consecutive sessions'
          }
          icon={Flame}
          color="warning"
        />

        <StatsCard
          title="Upcoming Events"
          value={`${eventsCount}`}
          description={
            eventsCount > 0 ? 'Upcoming club workshops' : 'No upcoming events'
          }
          icon={Calendar}
          color="success"
        />
      </div>

      {/* Row 1: Today's Peer Session & Attendance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <TodaySessionCard
          todaySession={dashboardData?.todaySession}
          upcomingSession={dashboardData?.upcomingSession}
        />
        <AttendanceTrend attendance={attendance} />
      </div>

      {/* Row 2: Recent Sessions, Events, Broadcasts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <RecentSessions recentSessions={dashboardData?.recentSessions || []} />
        <EventsCard events={dashboardData?.events} />
        <BroadcastsCard broadcasts={dashboardData?.broadcasts || []} />
      </div>

      {/* Row 3: Club Pulse Strip */}
      <ClubPulse club={dashboardData?.club} />
    </div>
  );
};

export default Dashboard;
