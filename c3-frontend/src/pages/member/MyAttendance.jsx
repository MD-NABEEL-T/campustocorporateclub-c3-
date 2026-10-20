import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { UserCheck, Calendar, XCircle, Flame, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const MyAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendance/me');
        if (isMounted) setData(res.data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load attendance record');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAttendance();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Loader fullScreen label="Fetching your attendance data..." />;
  if (error)
    return (
      <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium">
        {error}
      </div>
    );
  if (!data) return null;

  const hasSessions = data.totalSessions > 0 && data.percentage !== null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">My Attendance Record</h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Personal attendance metrics for daily C3 peer sessions since joining
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Attendance Score"
          value={hasSessions ? `${data.percentage}%` : 'No sessions yet'}
          description={hasSessions ? 'Turnout rate since joining' : 'No sessions conducted yet'}
          icon={UserCheck}
          color="primary"
        />
        <StatsCard
          title="Sessions Attended"
          value={data.presentCount}
          description={`Out of ${data.totalSessions} total sessions`}
          icon={Calendar}
          color="success"
        />
        <StatsCard
          title="Sessions Missed"
          value={data.absentCount}
          description="Absences recorded"
          icon={XCircle}
          color="warning"
        />
        <StatsCard
          title="Current Streak"
          value={data.currentStreak ? `${data.currentStreak} Sessions` : '0'}
          description="Consecutive present turnout"
          icon={Flame}
          color="accent"
        />
      </div>

      {/* Turnout Progress Card */}
      <Card className="bg-zinc-950/80 border border-white/10">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-white">Attendance Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-zinc-400">Overall Turnout Progress</span>
              <span className="font-mono font-bold text-white">
                {hasSessions ? `${data.percentage}%` : 'No sessions yet'}
              </span>
            </div>
            {hasSessions ? (
              <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-white/10">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, data.percentage))}%` }}
                />
              </div>
            ) : (
              <div className="py-2 text-xs text-zinc-500 font-mono">
                No peer sessions have been conducted since your account was created.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session History Table (Last 10 Sessions) */}
      <Card className="overflow-hidden p-0 bg-zinc-950/80 border border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Clock className="w-4 h-4 text-white" />
            <span>Recent Session History (Last 10)</span>
          </div>
        </div>

        {data.history?.length === 0 ? (
          <div className="p-10 text-center text-zinc-500 font-mono text-xs">
            No session history recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 text-xs font-mono uppercase bg-zinc-900/60">
                  <th className="py-3 px-4 sm:px-6">Date</th>
                  <th className="py-3 px-4 sm:px-6">Topic</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {data.history?.map((session) => (
                  <tr key={session._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs text-zinc-400">
                      {formatDate(session.date)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">
                      {session.topic}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      {session.status === 'present' ? (
                        <Badge variant="success">Present</Badge>
                      ) : (
                        <Badge variant="danger">Absent</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MyAttendance;
