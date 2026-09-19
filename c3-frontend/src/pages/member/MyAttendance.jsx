import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { Loader } from '../../components/ui/Loader';
import { UserCheck, Calendar, XCircle } from 'lucide-react';

const MyAttendance = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchAttendance = async () => {
      if (!user?._id) return;
      try {
        const res = await api.get(`/attendance/member/${user._id}`);
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
  }, [user?._id]);

  if (loading) return <Loader fullScreen label="Fetching your attendance data..." />;
  if (error)
    return (
      <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium">
        {error}
      </div>
    );
  if (!data) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">My Attendance Record</h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Personal attendance metrics for daily C3 peer sessions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard
          title="Attendance Score"
          value={`${data.percentage}%`}
          description="Global session turnout rate"
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
      </div>

      <Card className="bg-zinc-950/80 border border-white/10">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg text-white">Attendance Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-zinc-400">Overall Turnout Progress</span>
              <span className="font-mono font-bold text-white">{data.percentage}%</span>
            </div>
            <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(data.percentage)))}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyAttendance;

