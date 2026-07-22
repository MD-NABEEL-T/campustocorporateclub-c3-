import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Users, FileSpreadsheet } from 'lucide-react';

const AllAttendance = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/api/attendance/all', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMembers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendance metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user.token]);

  if (loading) return <Loader fullScreen label="Loading member attendance matrix..." />;
  if (error)
    return (
      <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium">
        {error}
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">Global Attendance Matrix</h2>
        <p className="text-sm text-[#94A3B8]">Attendance breakdown for all approved active members</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#071A2B]/40">
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <FileSpreadsheet className="w-4 h-4 text-[#38BDF8]" /> Total Approved Members: {members.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[#94A3B8] text-xs font-mono uppercase bg-[#071A2B]/80">
                <th className="py-3 px-6">Member Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Sessions Present</th>
                <th className="py-3 px-6">Sessions Absent</th>
                <th className="py-3 px-6">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-[#F8FAFC]">{m.name}</td>
                  <td className="py-3.5 px-6 text-[#94A3B8] font-mono text-xs">{m.email}</td>
                  <td className="py-3.5 px-6 font-mono text-[#22C55E]">{m.presentCount}</td>
                  <td className="py-3.5 px-6 font-mono text-[#EF4444]">{m.absentCount}</td>
                  <td className="py-3.5 px-6">
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
