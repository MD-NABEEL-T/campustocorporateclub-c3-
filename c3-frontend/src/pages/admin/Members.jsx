import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { Modal } from '../../components/ui/Modal';
import { PasswordInput } from '../../components/ui/PasswordInput';
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
  Crown,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  History,
  ChevronDown,
  ChevronUp,
  Lock,
  Calendar,
  Edit3,
  RotateCcw,
  Key,
  Copy,
  Check,
} from 'lucide-react';

const formatDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getTodayDateStr = () => {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
};

export const Members = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved'
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'coordinator' | 'member'

  // Coordinator role modal state
  const [coordinatorModalTarget, setCoordinatorModalTarget] = useState(null); // { member, newRole: 'coordinator' | 'member' }
  const [coordinatorSubmitting, setCoordinatorSubmitting] = useState(false);
  const [coordinatorModalError, setCoordinatorModalError] = useState('');

  // Owner admin action modal state
  const [roleModalTarget, setRoleModalTarget] = useState(null); // { member, makeAdmin }
  const [ownerPassword, setOwnerPassword] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [modalError, setModalError] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  // Attendance start date individual modal state
  const [startDateModalTarget, setStartDateModalTarget] = useState(null);
  const [startDateValue, setStartDateValue] = useState('');
  const [startDateSubmitting, setStartDateSubmitting] = useState(false);
  const [startDateError, setStartDateError] = useState('');

  // Bulk attendance start date modal state (admin only)
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkDate, setBulkDate] = useState('');
  const [bulkCount, setBulkCount] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkError, setBulkError] = useState('');

  // Admin audit log state (owner only)
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState('');

  // Password reset modal states
  const [resetConfirmTarget, setResetConfirmTarget] = useState(null);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetResult, setResetResult] = useState(null);
  const [hasCopiedPassword, setHasCopiedPassword] = useState(false);

  // Bulk dry-run effect
  useEffect(() => {
    if (!bulkModalOpen || !bulkDate) return;
    let cancelled = false;

    const runDryRun = async () => {
      setBulkLoading(true);
      setBulkError('');
      try {
        const res = await api.post('/users/attendance-start/bulk', {
          date: bulkDate,
          dryRun: true,
        });
        if (!cancelled) {
          setBulkCount(res.data.count);
        }
      } catch (err) {
        if (!cancelled) {
          setBulkError(err.response?.data?.message || 'Failed to calculate affected members');
          setBulkCount(null);
        }
      } finally {
        if (!cancelled) setBulkLoading(false);
      }
    };

    const timer = setTimeout(runDryRun, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [bulkModalOpen, bulkDate]);

  const openStartDateModal = (member) => {
    setStartDateModalTarget(member);
    setStartDateError('');
    const d = new Date(member.attendanceStartDate || member.createdAt);
    const dateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    setStartDateValue(dateStr);
  };

  const handleSaveStartDate = async (e) => {
    e?.preventDefault?.();
    if (!startDateModalTarget || !startDateValue || startDateSubmitting) return;

    setStartDateSubmitting(true);
    setStartDateError('');
    try {
      await api.put(`/users/${startDateModalTarget._id}/attendance-start`, {
        date: startDateValue,
      });
      setSuccessMsg(`Attendance counting date updated for ${startDateModalTarget.name}.`);
      setStartDateModalTarget(null);
      await fetchData();
    } catch (err) {
      setStartDateError(err.response?.data?.message || 'Failed to update attendance start date');
    } finally {
      setStartDateSubmitting(false);
    }
  };

  const handleResetStartDate = async () => {
    if (!startDateModalTarget || startDateSubmitting) return;

    setStartDateSubmitting(true);
    setStartDateError('');
    try {
      await api.put(`/users/${startDateModalTarget._id}/attendance-start`, {
        date: null,
      });
      setSuccessMsg(`Attendance counting date reset to signup date for ${startDateModalTarget.name}.`);
      setStartDateModalTarget(null);
      await fetchData();
    } catch (err) {
      setStartDateError(err.response?.data?.message || 'Failed to reset attendance start date');
    } finally {
      setStartDateSubmitting(false);
    }
  };

  const handleConfirmBulk = async (e) => {
    e?.preventDefault?.();
    if (!bulkDate || bulkSubmitting || bulkLoading) return;

    setBulkSubmitting(true);
    setBulkError('');
    try {
      const res = await api.post('/users/attendance-start/bulk', {
        date: bulkDate,
        dryRun: false,
      });
      setSuccessMsg(res.data?.message || `Updated attendance start date for ${res.data?.count || 0} members.`);
      setBulkModalOpen(false);
      await fetchData();
    } catch (err) {
      setBulkError(err.response?.data?.message || 'Failed to apply bulk start date');
    } finally {
      setBulkSubmitting(false);
    }
  };

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

  const currentCoordinators = approvedUsers.filter((m) => m.role === 'coordinator');
  const membersOnlyCount = approvedUsers.filter((m) => m.role === 'member' && !m.isOwner).length;

  const filteredApproved = approvedUsers.filter((m) => {
    if (roleFilter === 'coordinator' && m.role !== 'coordinator') return false;
    if (roleFilter === 'member' && (m.role === 'coordinator' || m.role === 'admin' || m.isOwner)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.section?.toLowerCase().includes(q) ||
      String(m.year || '').includes(q)
    );
  });

  const isCurrentUserOwner = Boolean(user?.isOwner);

  const canResetPassword = (target) => {
    if (!user || user.role !== 'admin') return false;
    if (target._id === user._id) return false;
    if (target.isOwner) return false;
    if (isCurrentUserOwner) return true;
    return target.role !== 'admin';
  };

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

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    setAuditError('');
    try {
      const res = await api.get('/users/admin-audit');
      setAuditLogs(res.data.slice(0, 20));
    } catch (err) {
      setAuditError(err.response?.data?.message || 'Failed to load admin audit logs');
    } finally {
      setAuditLoading(false);
    }
  };

  const handleRoleChangeConfirm = async (e) => {
    e.preventDefault();
    if (!roleModalTarget || !ownerPassword.trim() || !understood) return;

    setModalSubmitting(true);
    setModalError('');
    try {
      await api.put(`/users/${roleModalTarget.member._id}/admin`, {
        makeAdmin: roleModalTarget.makeAdmin,
        password: ownerPassword,
      });

      setSuccessMsg(
        roleModalTarget.makeAdmin
          ? `Successfully granted Admin privileges to ${roleModalTarget.member.name}.`
          : `Successfully revoked Admin privileges from ${roleModalTarget.member.name}.`
      );
      if (roleModalTarget.member._id === user?._id) {
        updateUser({ role: roleModalTarget.makeAdmin ? 'admin' : 'member' });
      }
      setRoleModalTarget(null);
      setOwnerPassword('');
      setUnderstood(false);
      fetchData();
      if (isAuditLogOpen) {
        fetchAuditLogs();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update administrative role');
    } finally {
      setModalSubmitting(false);
    }
  };

  const formatIST12Hour = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(dateStr));
    } catch {
      return new Date(dateStr).toLocaleString();
    }
  };

  const renderRoleBadge = (m) => {
    if (m.isOwner) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300">
          <Crown className="w-3 h-3 text-purple-400" />
          Owner
        </span>
      );
    }
    if (m.role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 border border-sky-500/30 text-sky-300">
          <Shield className="w-3 h-3 text-sky-400" />
          Admin
        </span>
      );
    }
    if (m.role === 'coordinator') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <ShieldCheck className="w-3 h-3 text-amber-400" />
          Coordinator
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800/80 border border-white/10 text-zinc-400">
        Member
      </span>
    );
  };

  const handleCoordinatorRoleConfirm = async (e) => {
    e.preventDefault();
    if (!coordinatorModalTarget) return;

    setCoordinatorSubmitting(true);
    setCoordinatorModalError('');
    try {
      await api.put(`/users/${coordinatorModalTarget.member._id}/role`, {
        role: coordinatorModalTarget.newRole,
      });

      setSuccessMsg(
        coordinatorModalTarget.newRole === 'coordinator'
          ? `Successfully appointed ${coordinatorModalTarget.member.name} as Coordinator.`
          : `Successfully removed ${coordinatorModalTarget.member.name} from Coordinator role.`
      );
      if (coordinatorModalTarget.member._id === user?._id) {
        updateUser({ role: coordinatorModalTarget.newRole });
      }
      setCoordinatorModalTarget(null);
      fetchData();
      if (isAuditLogOpen) {
        fetchAuditLogs();
      }
    } catch (err) {
      setCoordinatorModalError(err.response?.data?.message || 'Failed to update coordinator role');
    } finally {
      setCoordinatorSubmitting(false);
    }
  };

  const handleResetPasswordConfirm = async () => {
    if (!resetConfirmTarget || resetSubmitting) return;

    setResetSubmitting(true);
    setResetError('');
    try {
      const res = await api.post(`/users/${resetConfirmTarget._id}/reset-password`);
      const tempPassword = res.data?.temporaryPassword;
      const targetName = resetConfirmTarget.name;
      setResetConfirmTarget(null);
      setResetResult({
        name: targetName,
        tempPassword,
      });
      setHasCopiedPassword(false);
      setSuccessMsg(`Password reset successfully for ${targetName}.`);
      if (isAuditLogOpen) {
        fetchAuditLogs();
      }
    } catch (err) {
      setResetError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleCopyTempPassword = async () => {
    if (!resetResult?.tempPassword) return;
    try {
      await navigator.clipboard.writeText(resetResult.tempPassword);
      setHasCopiedPassword(true);
      setTimeout(() => setHasCopiedPassword(false), 2500);
    } catch {
      // fallback
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
      setSuccessMsg(`Approved ${memberName}.`);
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
        <div className="space-y-4">
          {/* Active Coordinators Quick Panel */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-xl space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Current Club Coordinators</h3>
                  <p className="text-[11px] text-zinc-400">
                    Trusted members assigned to manage day-to-day sessions, rosters, and announcements.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 shrink-0">
                {currentCoordinators.length} Assigned
              </span>
            </div>

            {currentCoordinators.length === 0 ? (
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/5 text-xs text-zinc-400 font-mono text-center">
                No coordinators currently assigned. Click &quot;Make coordinator&quot; on any approved member below.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {currentCoordinators.map((c) => (
                  <div
                    key={c._id}
                    className="p-3 rounded-xl bg-zinc-900/70 border border-white/10 flex items-center justify-between gap-2.5 shadow-sm hover:border-white/20 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">{c.name}</p>
                      <p className="text-[11px] font-mono text-zinc-400 truncate">
                        {c.section ? `${c.section} ` : ''}{c.year ? `• Year ${c.year}` : ''}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCoordinatorModalTarget({ member: c, newRole: 'member' });
                        setCoordinatorModalError('');
                      }}
                      className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 h-8 px-2.5 shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Members Table Card */}
          <Card className="overflow-hidden p-0 bg-zinc-950 border border-white/10 rounded-2xl shadow-xl">
            <div className="p-4 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-900/40">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mr-2">
                  <Users className="w-4 h-4 text-white" />
                  <span>Approved: {filteredApproved.length}</span>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-1.5 p-1 bg-zinc-900 border border-white/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRoleFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      roleFilter === 'all'
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    All ({approvedUsers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('coordinator')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      roleFilter === 'coordinator'
                        ? 'bg-amber-400 text-black font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-amber-300'
                    }`}
                  >
                    Coordinators ({currentCoordinators.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('member')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      roleFilter === 'member'
                        ? 'bg-white text-black font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Members ({membersOnlyCount})
                  </button>
                </div>

                {user?.role === 'admin' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setBulkDate(getTodayDateStr());
                      setBulkModalOpen(true);
                      setBulkCount(null);
                      setBulkError('');
                    }}
                    className="text-xs text-white border border-white/15 hover:bg-white/10 shrink-0"
                    leftIcon={<Calendar className="w-3.5 h-3.5 text-amber-400" />}
                  >
                    Set start date for everyone
                  </Button>
                )}
              </div>

              <div className="relative w-full md:w-64">
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
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-white text-sm truncate">{m.name}</h3>
                          {renderRoleBadge(m)}
                        </div>
                        <p className="text-zinc-400 font-mono text-xs truncate">{m.email}</p>
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

                    <div className="flex items-center justify-between text-xs text-zinc-300 pt-2 border-t border-white/5">
                      <div className="flex flex-col min-w-0 flex-1 pr-2">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Counting From</span>
                        <span className={`font-mono text-xs font-semibold ${m.attendanceStartDate ? 'text-amber-300' : 'text-white'}`}>
                          {formatDate(m.attendanceStartDate || m.createdAt)} {m.attendanceStartDate ? '(custom)' : '(signup date)'}
                        </span>
                        {m.attendanceStartDate && m.attendanceStartSetBy && (
                          <span className="text-[10px] text-zinc-400 truncate">
                            Set by {m.attendanceStartSetBy.name || m.attendanceStartSetBy.email} on {formatDate(m.attendanceStartSetAt)}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStartDateModal(m)}
                        className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white border-white/10 shrink-0"
                        leftIcon={<Calendar className="w-3.5 h-3.5 text-amber-400" />}
                      >
                        Edit date
                      </Button>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-end gap-2">
                      {/* Coordinator action for non-admin, non-owner members */}
                      {!m.isOwner && m.role !== 'admin' && (
                        m.role === 'coordinator' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCoordinatorModalTarget({ member: m, newRole: 'member' });
                              setCoordinatorModalError('');
                            }}
                            className="text-xs text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 w-full sm:w-auto justify-center"
                            leftIcon={<ShieldOff className="w-3.5 h-3.5" />}
                          >
                            Remove coordinator
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCoordinatorModalTarget({ member: m, newRole: 'coordinator' });
                              setCoordinatorModalError('');
                            }}
                            className="text-xs text-zinc-300 hover:text-white border-white/10 w-full sm:w-auto justify-center"
                            leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                          >
                            Make coordinator
                          </Button>
                        )
                      )}

                      {/* Owner Admin Actions */}
                      {isCurrentUserOwner && !m.isOwner && (
                        m.role === 'admin' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setRoleModalTarget({ member: m, makeAdmin: false });
                              setOwnerPassword('');
                              setUnderstood(false);
                              setModalError('');
                            }}
                            className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full sm:w-auto justify-center"
                            leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
                          >
                            Remove admin
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setRoleModalTarget({ member: m, makeAdmin: true });
                              setOwnerPassword('');
                              setUnderstood(false);
                              setModalError('');
                            }}
                            className="text-xs text-white border border-white/15 hover:bg-white/10 w-full sm:w-auto justify-center"
                            leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                          >
                            Make admin
                          </Button>
                        )
                      )}

                      {/* Admin-assisted Password Reset */}
                      {canResetPassword(m) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setResetConfirmTarget(m);
                            setResetError('');
                          }}
                          className="text-xs text-zinc-300 hover:text-white border-white/10 hover:border-amber-500/30 w-full sm:w-auto justify-center"
                          leftIcon={<Key className="w-3.5 h-3.5 text-amber-400" />}
                        >
                          Reset password
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= 640px) */}
              <div className="hidden sm:block overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 text-xs font-mono uppercase bg-zinc-900/60">
                      <th className="py-3.5 px-4 sm:px-6">Member Name</th>
                      <th className="py-3.5 px-4 sm:px-6">Role</th>
                      <th className="py-3.5 px-4 sm:px-6">Email</th>
                      <th className="py-3.5 px-4 sm:px-6">Section / Year</th>
                      <th className="py-3.5 px-4 sm:px-6">Counting From</th>
                      <th className="py-3.5 px-4 sm:px-6">Present</th>
                      <th className="py-3.5 px-4 sm:px-6">Absent</th>
                      <th className="py-3.5 px-4 sm:px-6">Attendance %</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredApproved.map((m) => (
                      <tr key={m._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">{m.name}</td>
                        <td className="py-3.5 px-4 sm:px-6">{renderRoleBadge(m)}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-zinc-400 font-mono text-xs">{m.email}</td>
                        <td className="py-3.5 px-4 sm:px-6 text-zinc-300 text-xs">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-mono mr-2">
                            {m.section || 'CSE'}
                          </span>
                          {m.year ? `Year ${m.year}` : ''}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-1.5">
                            <div className="flex flex-col min-w-0">
                              <span className={`font-mono text-xs font-semibold flex items-center gap-1 ${m.attendanceStartDate ? 'text-amber-300' : 'text-zinc-300'}`}>
                                <Calendar className="w-3 h-3 text-zinc-400 shrink-0" />
                                {formatDate(m.attendanceStartDate || m.createdAt)}
                              </span>
                              {m.attendanceStartDate ? (
                                <span
                                  className="text-[10px] text-zinc-400 truncate max-w-[140px]"
                                  title={m.attendanceStartSetBy ? `Set by ${m.attendanceStartSetBy.name || m.attendanceStartSetBy.email} on ${formatDate(m.attendanceStartSetAt)}` : 'Custom start date'}
                                >
                                  {m.attendanceStartSetBy ? `by ${m.attendanceStartSetBy.name || m.attendanceStartSetBy.email}` : 'custom'}
                                </span>
                              ) : (
                                <span className="text-[10px] text-zinc-500 font-mono">(signup date)</span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openStartDateModal(m)}
                              className="h-8 w-8 p-0 flex items-center justify-center text-zinc-400 hover:text-white shrink-0"
                              title="Edit attendance start date"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
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
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="flex items-center justify-end gap-2 flex-wrap">
                            {/* Coordinator action for non-admin, non-owner members */}
                            {!m.isOwner && m.role !== 'admin' && (
                              m.role === 'coordinator' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setCoordinatorModalTarget({ member: m, newRole: 'member' });
                                    setCoordinatorModalError('');
                                  }}
                                  className="text-xs text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                                  leftIcon={<ShieldOff className="w-3.5 h-3.5" />}
                                >
                                  Remove coordinator
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setCoordinatorModalTarget({ member: m, newRole: 'coordinator' });
                                    setCoordinatorModalError('');
                                  }}
                                  className="text-xs text-zinc-300 hover:text-white border-white/10 hover:border-white/20"
                                  leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                                >
                                  Make coordinator
                                </Button>
                              )
                            )}

                            {/* Owner Make Admin / Remove Admin */}
                            {isCurrentUserOwner && (
                              m.isOwner ? (
                                <span className="text-xs text-zinc-500 font-mono italic">Primary Owner</span>
                              ) : m.role === 'admin' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setRoleModalTarget({ member: m, makeAdmin: false });
                                    setOwnerPassword('');
                                    setUnderstood(false);
                                    setModalError('');
                                  }}
                                  className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                  leftIcon={<ShieldAlert className="w-3.5 h-3.5" />}
                                >
                                  Remove admin
                                </Button>
                              ) : (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setRoleModalTarget({ member: m, makeAdmin: true });
                                    setOwnerPassword('');
                                    setUnderstood(false);
                                    setModalError('');
                                  }}
                                  className="text-xs text-white border border-white/15 hover:bg-white/10"
                                  leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                                >
                                  Make admin
                                </Button>
                              )
                            )}

                            {/* Admin-assisted Password Reset */}
                            {canResetPassword(m) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setResetConfirmTarget(m);
                                  setResetError('');
                                }}
                                className="text-xs text-zinc-300 hover:text-white border-white/10 hover:border-amber-500/30"
                                leftIcon={<Key className="w-3.5 h-3.5 text-amber-400" />}
                              >
                                Reset password
                              </Button>
                            )}
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
        </div>
      )}

      {/* Collapsible Admin Access Log Card (Owner Only) */}
      {isCurrentUserOwner && (
        <Card className="overflow-hidden p-0 bg-zinc-950 border border-white/10 rounded-2xl shadow-xl">
          <button
            type="button"
            onClick={() => {
              const nextState = !isAuditLogOpen;
              setIsAuditLogOpen(nextState);
              if (nextState && auditLogs.length === 0) {
                fetchAuditLogs();
              }
            }}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <History className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-white">Admin Access Log</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Owner Only
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Audit trail of administrative privilege grants and revocations (last 20 entries)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-xs font-mono hidden sm:inline">
                {isAuditLogOpen ? 'Collapse' : 'Expand'}
              </span>
              {isAuditLogOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isAuditLogOpen && (
            <div className="border-t border-white/10 bg-zinc-900/30">
              {auditLoading ? (
                <div className="p-8 text-center">
                  <Loader size="md" label="Loading audit logs..." />
                </div>
              ) : auditError ? (
                <div className="p-6 text-center space-y-3">
                  <div className="text-xs text-red-400">{auditError}</div>
                  <Button size="sm" variant="secondary" onClick={fetchAuditLogs}>
                    Retry
                  </Button>
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="p-10 text-center text-zinc-500 font-mono text-xs">
                  No administrative role changes recorded yet.
                </div>
              ) : (
                <>
                  {/* Mobile Stacked Logs (< 640px) */}
                  <div className="p-3 sm:hidden space-y-2.5">
                    {auditLogs.slice(0, 20).map((log) => (
                      <div
                        key={log._id}
                        className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-white truncate">
                            {log.targetName}
                          </span>
                          {log.action === 'grant_admin' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shrink-0">
                              <ShieldCheck className="w-3 h-3" />
                              Granted Admin
                            </span>
                          ) : log.action === 'revoke_admin' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 border border-red-500/30 text-red-300 shrink-0">
                              <ShieldOff className="w-3 h-3" />
                              Revoked Admin
                            </span>
                          ) : log.action === 'grant_coordinator' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 shrink-0">
                              <ShieldCheck className="w-3 h-3" />
                              Appointed Coordinator
                            </span>
                          ) : log.action === 'reset_password' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 shrink-0">
                              <Key className="w-3 h-3" />
                              Reset Password
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-500/10 border border-zinc-500/30 text-zinc-300 shrink-0">
                              <ShieldOff className="w-3 h-3" />
                              Removed Coordinator
                            </span>
                          )}
                        </div>
                        <div className="text-zinc-400 font-mono text-[11px] truncate">
                          {log.targetEmail}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1.5 border-t border-white/5">
                          <span>By: {log.actor?.name || 'Owner'}</span>
                          <span className="font-mono text-zinc-400">{formatIST12Hour(log.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table (>= 640px) */}
                  <div className="hidden sm:block overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[650px]">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-400 text-xs font-mono uppercase bg-zinc-900/60">
                          <th className="py-3 px-4 sm:px-6">Actor</th>
                          <th className="py-3 px-4 sm:px-6">Action</th>
                          <th className="py-3 px-4 sm:px-6">Target User</th>
                          <th className="py-3 px-4 sm:px-6 text-right">Timestamp (IST)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {auditLogs.slice(0, 20).map((log) => (
                          <tr key={log._id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-4 sm:px-6 font-medium text-white">
                              {log.actor?.name || 'Owner'}
                              <span className="block text-[11px] font-mono text-zinc-400">
                                {log.actor?.email}
                              </span>
                            </td>
                            <td className="py-3 px-4 sm:px-6">
                              {log.action === 'grant_admin' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                                  <ShieldCheck className="w-3 h-3" />
                                  Granted Admin
                                </span>
                              ) : log.action === 'revoke_admin' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 border border-red-500/30 text-red-300">
                                  <ShieldOff className="w-3 h-3" />
                                  Revoked Admin
                                </span>
                              ) : log.action === 'grant_coordinator' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                                  <ShieldCheck className="w-3 h-3" />
                                  Appointed Coordinator
                                </span>
                              ) : log.action === 'reset_password' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                                  <Key className="w-3 h-3" />
                                  Reset Password
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-500/10 border border-zinc-500/30 text-zinc-300">
                                  <ShieldOff className="w-3 h-3" />
                                  Removed Coordinator
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 sm:px-6 font-medium text-white">
                              {log.targetName}
                              <span className="block text-[11px] font-mono text-zinc-400">
                                {log.targetEmail}
                              </span>
                            </td>
                            <td className="py-3 px-4 sm:px-6 text-right font-mono text-zinc-400">
                              {formatIST12Hour(log.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Owner Confirmation Modal */}
      <Modal
        isOpen={Boolean(roleModalTarget)}
        onClose={() => {
          if (!modalSubmitting) {
            setRoleModalTarget(null);
            setOwnerPassword('');
            setUnderstood(false);
            setModalError('');
          }
        }}
        title={roleModalTarget?.makeAdmin ? 'Grant Administrator Privileges' : 'Revoke Administrator Access'}
        description={
          roleModalTarget?.makeAdmin
            ? `Elevate ${roleModalTarget?.member?.name} to portal Administrator.`
            : `Revoke administrative privileges from ${roleModalTarget?.member?.name}.`
        }
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleRoleChangeConfirm} className="space-y-4">
          {/* Target user info */}
          <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Target Member:</span>
              <span className="font-semibold text-white">{roleModalTarget?.member?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Email:</span>
              <span className="font-mono text-zinc-300">{roleModalTarget?.member?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Current Role:</span>
              <span className="capitalize text-zinc-300">{roleModalTarget?.member?.role || 'Member'}</span>
            </div>
          </div>

          {/* Explanation of consequences */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-2">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{roleModalTarget?.makeAdmin ? 'Administrative Privileges Granted' : 'Administrative Privileges Revoked'}</span>
            </div>
            {roleModalTarget?.makeAdmin ? (
              <ul className="list-disc pl-4 space-y-1 text-zinc-300 text-[11px] leading-relaxed">
                <li>Approve or decline pending member registrations.</li>
                <li>View junior recruitment applicants, contact details, and resumes.</li>
                <li>Create, edit, and delete official club sessions and events.</li>
                <li>Manage official club attendance records and rosters.</li>
              </ul>
            ) : (
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                The user will immediately lose access to the administrative dashboard, attendance marking, applicant management, and session controls. They will return to standard club member status.
              </p>
            )}
          </div>

          {/* Password re-entry */}
          <PasswordInput
            label="Owner Password"
            placeholder="Enter your owner password to confirm"
            value={ownerPassword}
            onChange={(e) => setOwnerPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {/* Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-zinc-300 select-none">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-zinc-900 text-white focus:ring-0 cursor-pointer"
            />
            <span>I understand the consequences and authorize this administrative role change.</span>
          </label>

          {/* Inline Error */}
          {modalError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{modalError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={modalSubmitting}
              onClick={() => {
                setRoleModalTarget(null);
                setOwnerPassword('');
                setUnderstood(false);
                setModalError('');
              }}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={roleModalTarget?.makeAdmin ? 'primary' : 'secondary'}
              size="md"
              disabled={!ownerPassword.trim() || !understood || modalSubmitting}
              isLoading={modalSubmitting}
              className={`text-xs font-semibold ${
                roleModalTarget?.makeAdmin
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-red-500 text-white hover:bg-red-600 border-none'
              }`}
            >
              {roleModalTarget?.makeAdmin ? 'Confirm & Grant Admin' : 'Confirm & Remove Admin'}
            </Button>
          </div>
        </form>
      </Modal>
      {/* Coordinator Confirmation Modal */}
      <Modal
        isOpen={Boolean(coordinatorModalTarget)}
        onClose={() => {
          if (!coordinatorSubmitting) {
            setCoordinatorModalTarget(null);
            setCoordinatorModalError('');
          }
        }}
        title={
          coordinatorModalTarget?.newRole === 'coordinator'
            ? 'Appoint Club Coordinator'
            : 'Remove Club Coordinator'
        }
        description={
          coordinatorModalTarget?.newRole === 'coordinator'
            ? `Grant coordinator operational access to ${coordinatorModalTarget?.member?.name}.`
            : `Remove coordinator role from ${coordinatorModalTarget?.member?.name}.`
        }
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCoordinatorRoleConfirm} className="space-y-4">
          <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Target Member:</span>
              <span className="font-semibold text-white">{coordinatorModalTarget?.member?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Email:</span>
              <span className="font-mono text-zinc-300">{coordinatorModalTarget?.member?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Department & Year:</span>
              <span className="text-zinc-300">
                {coordinatorModalTarget?.member?.section || 'CSE'}{' '}
                {coordinatorModalTarget?.member?.year ? `• Year ${coordinatorModalTarget.member.year}` : ''}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1.5">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {coordinatorModalTarget?.newRole === 'coordinator'
                  ? 'Coordinator Operational Access'
                  : 'Role Demotion to Regular Member'}
              </span>
            </div>
            {coordinatorModalTarget?.newRole === 'coordinator' ? (
              <ul className="list-disc pl-4 space-y-1 text-zinc-300 text-[11px] leading-relaxed">
                <li>Create and edit peer learning sessions and upload session photos.</li>
                <li>Mark and save attendance rosters and view the attendance matrix.</li>
                <li>Post and manage daily session announcements and broadcasts.</li>
                <li>Cannot approve members, review applications, or delete sessions.</li>
              </ul>
            ) : (
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {coordinatorModalTarget?.member?.name} will return to standard member status (view-only). They will no longer have access to staff tools, session creation, or attendance marking.
              </p>
            )}
          </div>

          {coordinatorModalError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{coordinatorModalError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={coordinatorSubmitting}
              onClick={() => {
                setCoordinatorModalTarget(null);
                setCoordinatorModalError('');
              }}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={coordinatorModalTarget?.newRole === 'coordinator' ? 'primary' : 'secondary'}
              size="md"
              disabled={coordinatorSubmitting}
              isLoading={coordinatorSubmitting}
              className={`text-xs font-semibold ${
                coordinatorModalTarget?.newRole === 'coordinator'
                  ? 'bg-amber-400 text-black hover:bg-amber-300 border-none'
                  : 'bg-red-500 text-white hover:bg-red-600 border-none'
              }`}
            >
              {coordinatorModalTarget?.newRole === 'coordinator'
                ? 'Confirm & Appoint'
                : 'Confirm & Remove'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Individual Attendance Start Date Modal */}
      <Modal
        isOpen={Boolean(startDateModalTarget)}
        onClose={() => {
          if (!startDateSubmitting) {
            setStartDateModalTarget(null);
            setStartDateError('');
          }
        }}
        title="Edit Attendance Counting Date"
        description={`Configure when attendance records begin for ${startDateModalTarget?.name}.`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveStartDate} className="space-y-4">
          <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Member:</span>
              <span className="font-semibold text-white">{startDateModalTarget?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Signup Date:</span>
              <span className="font-mono text-zinc-300">{formatDate(startDateModalTarget?.createdAt)}</span>
            </div>
            {startDateModalTarget?.attendanceStartDate && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Current Start Date:</span>
                <span className="font-mono text-amber-300 font-semibold">{formatDate(startDateModalTarget?.attendanceStartDate)}</span>
              </div>
            )}
            {startDateModalTarget?.attendanceStartSetBy && (
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-white/5">
                <span>Last Updated By:</span>
                <span className="text-zinc-300">
                  {startDateModalTarget?.attendanceStartSetBy?.name || startDateModalTarget?.attendanceStartSetBy?.email} on {formatDate(startDateModalTarget?.attendanceStartSetAt)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span>Count Attendance From</span>
              <span className="text-[10px] text-zinc-500 font-mono">YYYY-MM-DD</span>
            </label>
            <input
              type="date"
              value={startDateValue}
              onChange={(e) => setStartDateValue(e.target.value)}
              max={getTodayDateStr()}
              min="2020-01-01"
              required
              className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/15 rounded-xl text-white focus:outline-none focus:border-white/40"
            />
            <p className="text-[11px] text-zinc-500">
              Sessions conducted on or after this date will be counted toward this member&apos;s attendance score.
            </p>
          </div>

          {startDateError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{startDateError}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-white/10">
            {startDateModalTarget?.attendanceStartDate ? (
              <Button
                type="button"
                variant="ghost"
                size="md"
                disabled={startDateSubmitting}
                onClick={handleResetStartDate}
                className="text-xs text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset to Signup Date
              </Button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="md"
                disabled={startDateSubmitting}
                onClick={() => {
                  setStartDateModalTarget(null);
                  setStartDateError('');
                }}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={startDateSubmitting || !startDateValue}
                isLoading={startDateSubmitting}
                className="text-xs font-semibold bg-white text-black hover:bg-zinc-200"
              >
                Save Start Date
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Admin Bulk Attendance Start Date Modal */}
      <Modal
        isOpen={bulkModalOpen}
        onClose={() => {
          if (!bulkSubmitting) {
            setBulkModalOpen(false);
            setBulkError('');
          }
        }}
        title="Set Start Date for Everyone"
        description="Update the attendance cutoff for all approved members whose current cutoff is after this date."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmBulk} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span>Target Attendance Start Date</span>
              <span className="text-[10px] text-zinc-500 font-mono">YYYY-MM-DD</span>
            </label>
            <input
              type="date"
              value={bulkDate}
              onChange={(e) => setBulkDate(e.target.value)}
              max={getTodayDateStr()}
              min="2020-01-01"
              required
              className="w-full px-3 py-2 text-xs bg-zinc-900 border border-white/15 rounded-xl text-white focus:outline-none focus:border-white/40"
            />
            <p className="text-[11px] text-zinc-500">
              Only members whose current cutoff is later than this date will be updated. Members whose cutoff is already earlier or equal will be kept as-is.
            </p>
          </div>

          {/* Dry Run Preview Box */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 text-xs">
            {bulkLoading ? (
              <div className="flex items-center gap-2 text-zinc-400">
                <Loader size="sm" />
                <span>Checking affected members...</span>
              </div>
            ) : bulkCount !== null ? (
              bulkCount > 0 ? (
                <div className="space-y-1 text-emerald-300">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{bulkCount} member{bulkCount === 1 ? '' : 's'} will change</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Their attendance counting date will be moved to {formatDate(bulkDate)}.
                  </p>
                </div>
              ) : (
                <div className="text-zinc-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span>0 members will change (all current cutoffs are already on or before {formatDate(bulkDate)}).</span>
                </div>
              )
            ) : null}
          </div>

          {bulkError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{bulkError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={bulkSubmitting}
              onClick={() => {
                setBulkModalOpen(false);
                setBulkError('');
              }}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={bulkSubmitting || bulkLoading || !bulkDate || bulkCount === 0 || bulkCount === null}
              isLoading={bulkSubmitting}
              className="text-xs font-semibold bg-white text-black hover:bg-zinc-200 disabled:opacity-40"
            >
              Apply to {bulkCount ?? ''} Member{bulkCount === 1 ? '' : 's'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Confirmation Modal */}
      <Modal
        isOpen={Boolean(resetConfirmTarget)}
        onClose={() => {
          if (!resetSubmitting) {
            setResetConfirmTarget(null);
            setResetError('');
          }
        }}
        title="Reset Member Password"
        description={`Generate a temporary password for ${resetConfirmTarget?.name}.`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Target Member:</span>
              <span className="font-semibold text-white">{resetConfirmTarget?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Email:</span>
              <span className="font-mono text-zinc-300">{resetConfirmTarget?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Role:</span>
              <span className="capitalize text-zinc-300">{resetConfirmTarget?.role || 'Member'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-2">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Important Security Notice</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-zinc-300 text-[11px] leading-relaxed">
              <li>This will immediately revoke their current password and all active login sessions.</li>
              <li>A secure 10-character temporary password will be generated for you to share with them privately.</li>
              <li>They will be required to set a new password immediately upon their next login.</li>
            </ul>
          </div>

          {resetError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{resetError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={resetSubmitting}
              onClick={() => {
                setResetConfirmTarget(null);
                setResetError('');
              }}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              disabled={resetSubmitting}
              isLoading={resetSubmitting}
              onClick={handleResetPasswordConfirm}
              className="text-xs font-semibold bg-amber-400 text-black hover:bg-amber-300 border-none"
              leftIcon={<Key className="w-3.5 h-3.5" />}
            >
              Generate Temp Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Temporary Password Result Modal */}
      <Modal
        isOpen={Boolean(resetResult)}
        onClose={() => setResetResult(null)}
        title="Temporary Password Generated"
        description={`Password reset complete for ${resetResult?.name}.`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Password successfully reset. Their previous sessions have been logged out.</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">Temporary Password</label>
            <div className="p-3 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-between gap-3">
              <span className="font-mono text-base font-bold text-amber-300 tracking-wider select-all">
                {resetResult?.tempPassword}
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleCopyTempPassword}
                className="h-8 px-3 text-xs shrink-0"
                leftIcon={hasCopiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-300" />}
              >
                {hasCopiedPassword ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
            <p className="leading-relaxed">
              Share this privately. They must set a new password at next login.
            </p>
          </div>

          <div className="flex items-center justify-end pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => setResetResult(null)}
              className="text-xs font-semibold bg-white text-black hover:bg-zinc-200"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Members;
