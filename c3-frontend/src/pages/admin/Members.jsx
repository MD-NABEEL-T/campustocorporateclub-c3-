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
  X,
  Search,
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPending = pendingUsers.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.section?.toLowerCase().includes(q) ||
      String(u.year || '').includes(q) ||
      u.registerNumber?.toLowerCase().includes(q)
    );
  });

  const filteredApproved = approvedUsers.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.section?.toLowerCase().includes(q) ||
      String(m.year || '').includes(q)
    );
  });

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
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-2xl w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals</span>
            {pendingUsers.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                {pendingUsers.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'approved'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Approved Members ({approvedUsers.length})</span>
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
        <Card className="overflow-hidden p-0 bg-zinc-950 border border-white/10 rounded-2xl shadow-xl">
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/40">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>
                Pending Requests: {filteredPending.length}
                {searchQuery.trim() && ` (filtered from ${pendingUsers.length})`}
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search pending members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {filteredPending.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs">
              {searchQuery.trim()
                ? `No pending requests match "${searchQuery.trim()}".`
                : 'No pending member sign-ups at this time.'}
            </div>
          ) : (
            <>
              {/* Mobile Stacked Cards (< 640px) */}
              <div className="p-3 sm:hidden space-y-3">
                {filteredPending.map((u) => (
                  <div
                    key={u._id}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-3 shadow-sm"
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{u.name}</h3>
                      <p className="text-zinc-400 font-mono text-xs truncate mt-0.5">{u.email}</p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-mono">
                        {u.section || 'CSE'}
                      </span>
                      {u.year && <span className="text-zinc-400">Year {u.year}</span>}
                      {u.registerNumber && (
                        <span className="text-zinc-500 font-mono ml-auto text-[11px]">
                          {u.registerNumber}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleApprove(u._id, u.name)}
                        isLoading={actionLoading === u._id}
                        className="w-full py-2.5 text-xs font-semibold bg-white text-black hover:bg-zinc-200 justify-center"
                        leftIcon={<UserCheck className="w-4 h-4" />}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={() => handleReject(u._id, u.name)}
                        disabled={actionLoading === u._id}
                        className="w-full py-2.5 text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 hover:text-red-300 justify-center"
                        leftIcon={<UserX className="w-4 h-4" />}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= 640px) */}
              <div className="hidden sm:block overflow-x-auto w-full">
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
                    {filteredPending.map((u) => (
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
            </>
          )}
        </Card>
      )}

      {/* Tab 2: Approved Members & Global Attendance */}
      {activeTab === 'approved' && (
        <Card className="overflow-hidden p-0 bg-zinc-950 border border-white/10 rounded-2xl shadow-xl">
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/40">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Users className="w-4 h-4 text-white" />
              <span>
                Total Approved Members: {filteredApproved.length}
                {searchQuery.trim() && ` (filtered from ${approvedUsers.length})`}
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search approved members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {filteredApproved.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 font-mono text-xs">
              {searchQuery.trim()
                ? `No approved members match "${searchQuery.trim()}".`
                : 'No approved members recorded yet.'}
            </div>
          ) : (
            <>
              {/* Mobile Stacked Cards (< 640px) */}
              <div className="p-3 sm:hidden space-y-3">
                {filteredApproved.map((m) => (
                  <div
                    key={m._id}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">{m.name}</h3>
                        <p className="text-zinc-400 font-mono text-xs truncate mt-0.5">{m.email}</p>
                      </div>
                      <div className="shrink-0">
                        {m.percentage !== null && m.percentage !== undefined ? (
                          <Badge
                            variant={
                              m.percentage >= 75
                                ? 'success'
                                : m.percentage >= 50
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {m.percentage}%
                          </Badge>
                        ) : (
                          <Badge variant="neutral">No sessions yet</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-300 pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-mono">
                          {m.section || 'CSE'}
                        </span>
                        {m.year && <span className="text-zinc-400">Year {m.year}</span>}
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {m.presentCount ?? 0} present &bull; {m.absentCount ?? 0} absent
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= 640px) */}
              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 text-xs font-mono uppercase bg-zinc-900/60">
                      <th className="py-3.5 px-4 sm:px-6">Member Name</th>
                      <th className="py-3.5 px-4 sm:px-6">Email</th>
                      <th className="py-3.5 px-4 sm:px-6">Section / Year</th>
                      <th className="py-3.5 px-4 sm:px-6">Present</th>
                      <th className="py-3.5 px-4 sm:px-6">Absent</th>
                      <th className="py-3.5 px-4 sm:px-6">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredApproved.map((m) => (
                      <tr key={m._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">{m.name}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-zinc-400 font-mono text-xs">{m.email}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-zinc-300 text-xs">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-mono mr-2">
                            {m.section || 'CSE'}
                          </span>
                          {m.year ? `Year ${m.year}` : ''}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-mono text-emerald-400">{m.presentCount}</td>
                        <td className="py-3.5 px-4 sm:px-6 font-mono text-red-400">{m.absentCount}</td>
                        <td className="py-3.5 px-4 sm:px-6">
                          {m.percentage !== null && m.percentage !== undefined ? (
                            <Badge
                              variant={
                                m.percentage >= 75
                                  ? 'success'
                                  : m.percentage >= 50
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {m.percentage}%
                            </Badge>
                          ) : (
                            <Badge variant="neutral">No sessions yet</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
};

export default Members;
