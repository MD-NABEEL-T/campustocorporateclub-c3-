import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { UserCheck, BookOpen, Calendar, Bell } from 'lucide-react';
import axios from '../../api/axios';

export const Dashboard = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(null);

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
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-transparent border border-white/10 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />
        <div className="relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            Welcome Back
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#F8FAFC] mt-1">
            Hello, {user?.name || 'Member'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 max-w-xl leading-relaxed">
            Track your peer session attendance, access learning resources, and participate in upcoming C3 events.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Attendance Rate"
          value={attendance ? `${attendance.percentage}%` : '100%'}
          description={attendance ? `${attendance.presentCount} of ${attendance.totalSessions} sessions attended` : 'Loading...'}
          icon={UserCheck}
          color="primary"
        />
        <StatsCard
          title="Daily Sessions"
          value="15 Min"
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
          value="Latest"
          description="Broadcast feed"
          icon={Bell}
          color="warning"
        />
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-zinc-950/80 border border-white/10">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-white">Today's Peer Session</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Daily 15-minute presentation session schedule and topic information.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950/80 border border-white/10">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg text-white">Recent Club Broadcasts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Official club announcements and schedule updates.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

