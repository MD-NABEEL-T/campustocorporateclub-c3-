import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { FileSpreadsheet } from 'lucide-react';

const AllAttendance = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      try {
        const res = await api.get('/attendance/all');
        if (isMounted) setMembers(res.data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load attendance metrics');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <Loader fullScreen label="Loading member attendance matrix..." />;
  if (error)
    return (
      <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium">
        {error}
      </div>
    );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">Global Attendance Matrix</h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Attendance breakdown for all approved active members</p>
      </div>

      <Card className="overflow-hidden p-0 bg-zinc-950/80 border border-white/10">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <FileSpreadsheet className="w-4 h-4 text-zinc-300" /> Total Approved Members: {members.length}
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-xs font-mono uppercase bg-zinc-900/60">
                <th className="py-3 px-4 sm:px-6">Member Name</th>
                <th className="py-3 px-4 sm:px-6">Email</th>
                <th className="py-3 px-4 sm:px-6">Sessions Present</th>
                <th className="py-3 px-4 sm:px-6">Sessions Absent</th>
                <th className="py-3 px-4 sm:px-6">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#F8FAFC]">{m.name}</td>
                  <td className="py-3.5 px-4 sm:px-6 text-[#94A3B8] font-mono text-xs">{m.email}</td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-[#22C55E]">{m.presentCount}</td>
                  <td className="py-3.5 px-4 sm:px-6 font-mono text-[#EF4444]">{m.absentCount}</td>
                  <td className="py-3.5 px-4 sm:px-6">
                    <Badge
                      variant={
                        parseFloat(m.percentage) >= 75
                          ? 'success'
                          : parseFloat(m.percentage) >= 50
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {m.percentage}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AllAttendance;

