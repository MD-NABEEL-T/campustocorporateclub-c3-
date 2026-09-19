import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  AlertCircle,
  Mail,
  Hash,
  BookOpen,
  X
} from 'lucide-react';

export const Members = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        api.get('/users/pending'),
        api.get('/attendance/all'), // includes approved members with attendance metrics
      ]);
      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load member records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (memberId, memberName) => {
    setActionLoading(memberId);
    setError('');
    try {
      await api.put(`/users/${memberId}/approve`);
      setSuccessMsg(`Approved ${memberName}. An approval email has been sent.`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve member');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to decline registration for ${memberName}?`)) {
      return;
    }

    setActionLoading(memberId);
    setError('');
    try {
      await api.delete(`/users/${memberId}`);
      setSuccessMsg(`Declined and removed registration for ${memberName}.`);
      setPendingUsers(pendingUsers.filter((u) => u._id !== memberId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to decline registration');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <Loader fullScreen label="Loading C3 member directory..." />;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Member Directory & Approvals</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review new C3 registration requests and monitor active member records.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending Approvals
            {pendingUsers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'approved'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Approved Members ({approvedUsers.length})
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Pending Registrations */}
      {activeTab === 'pending' && (
        <Card className="overflow-hidden p-0 bg-zinc-950 border border-white/10 rounded-2xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/40">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Pending Requests: {pendingUsers.length}</span>
            </div>
            <span className="text-[11px] text-zinc-500">Approving an account sends an automated welcome email</span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs">
              No pending member sign-ups at this time.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 text-xs font-mono uppercase bg-zinc-900/60">
                    <th className="py-3.5 px-4 sm:px-6">Name</th>
                    <th className="py-3.5 px-4 sm:px-6">Email</th>
                    <th className="py-3.5 px-4 sm:px-6">Section / Year</th>
                    <th className="py-3.5 px-4 sm:px-6">Register No</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {pendingUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-semibold text-white">{u.name}</td>
                      <td className="py-4 px-4 sm:px-6 text-zinc-400 font-mono text-xs">{u.email}</td>
                      <td className="py-4 px-4 sm:px-6 text-zinc-300 text-xs">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-mono mr-2">
                          {u.section || 'CSE'}
                        </span>
                        {u.year ? `Year ${u.year}` : ''}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-mono text-xs text-zinc-400">
                        {u.registerNumber || '—'}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprove(u._id, u.name)}
                            isLoading={actionLoading === u._id}
                            className="bg-white text-black hover:bg-zinc-200 text-xs font-semibold"
                            leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(u._id, u.name)}
                            disabled={actionLoading === u._id}
                            className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            leftIcon={<UserX className="w-3.5 h-3.5" />}
                          >
                            Decline
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab 2: Approved Members & Global Attendance */}
      {activeTab === 'approved' && (
        <Card className="overflow-hidden p-0 bg-zinc-950 border border-white/10 rounded-2xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/40">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Users className="w-4 h-4 text-white" /> Total Approved Members: {approvedUsers.length}
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 text-xs font-mono uppercase bg-zinc-900/60">
                  <th className="py-3.5 px-4 sm:px-6">Member Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Email</th>
                  <th className="py-3.5 px-4 sm:px-6">Present</th>
                  <th className="py-3.5 px-4 sm:px-6">Absent</th>
                  <th className="py-3.5 px-4 sm:px-6">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {approvedUsers.map((m) => (
                  <tr key={m._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">{m.name}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-zinc-400 font-mono text-xs">{m.email}</td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-emerald-400">{m.presentCount}</td>
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-red-400">{m.absentCount}</td>
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
      )}
    </div>
  );
};

export default Members;
