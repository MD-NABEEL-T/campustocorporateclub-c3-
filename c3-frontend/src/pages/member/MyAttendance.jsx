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
    const fetchAttendance = async () => {
      try {
        const res = await api.get(`/api/attendance/member/${user._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance record');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [user._id, user.token]);

  if (loading) return <Loader fullScreen label="Fetching your attendance data..." />;
  if (error)
    return (
      <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium">
        {error}
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">My Attendance Record</h2>
        <p className="text-sm text-[#94A3B8]">Personal attendance metrics for daily C3 peer sessions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Attendance Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#94A3B8]">Overall Turnout Progress</span>
              <span className="font-mono font-bold text-[#38BDF8]">{data.percentage}%</span>
            </div>
            <div className="w-full bg-[#071A2B] h-3 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-[#38BDF8] to-[#2DD4BF] h-full rounded-full transition-all duration-500"
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
