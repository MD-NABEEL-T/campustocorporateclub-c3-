import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import {
  ArrowLeft,
  Calendar,
  User,
  Search,
  AlertCircle,
  UserCheck,
  UserX,
  Save,
  X,
  Clock,
  RotateCcw,
} from 'lucide-react';

const formatIST12Hour = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d
    .toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();
};

const toIdString = (x) => String(x?._id ?? x ?? '').trim();

const SessionAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const outletCtx = useOutletContext();
  const collapsed = outletCtx?.collapsed ?? false;
  const basePath = user?.role === 'admin' ? '/admin' : '/staff';

  const [session, setSession] = useState(null);
  const [members, setMembers] = useState([]);
  const [absenteeIds, setAbsenteeIds] = useState(new Set());
  const [initialAbsenteeIds, setInitialAbsenteeIds] = useState(new Set());
  const [hasLoaded, setHasLoaded] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch session and approved members - build absent set only after BOTH have loaded
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [sessionRes, usersRes] = await Promise.all([
          api.get(`/sessions/${id}`),
          api.get('/users/attendees'),
        ]);

        if (isMounted) {
          const sessionData = sessionRes.data;
          const rosterData = usersRes.data || [];

          setSession(sessionData);
          setMembers(rosterData);

          // Normalize every absentee id to a string
          const rawAbsentees = sessionData?.absentees || [];
          const normalizedAbsent = new Set(
            rawAbsentees.map(toIdString).filter(Boolean)
          );

          setAbsenteeIds(normalizedAbsent);
          setInitialAbsenteeIds(new Set(normalizedAbsent));
          setHasLoaded(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load session attendance data');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Track unsaved changes against originally loaded absentees
  const hasUnsavedChanges = useMemo(() => {
    if (!hasLoaded) return false;
    if (initialAbsenteeIds.size !== absenteeIds.size) return true;
    for (const item of absenteeIds) {
      if (!initialAbsenteeIds.has(item)) return true;
    }
    return false;
  }, [hasLoaded, absenteeIds, initialAbsenteeIds]);

  // Warn on browser unload if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // In-app navigation guard
  const handleNavigateAway = (destination) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved attendance changes. Are you sure you want to leave without saving?'
      );
      if (!confirmLeave) return;
    }
    if (destination === -1) {
      navigate(-1);
    } else {
      navigate(destination);
    }
  };

  const toggleAbsentee = (memberRef) => {
    const strId = toIdString(memberRef);
    if (!strId) return;
    setAbsenteeIds((prev) => {
      const next = new Set(prev);
      if (next.has(strId)) {
        next.delete(strId);
      } else {
        next.add(strId);
      }
      return next;
    });
    setError('');
  };

  const handleMarkAllPresent = () => {
    setAbsenteeIds(new Set());
    setError('');
  };

  const handleSave = async () => {
    if (!hasLoaded || !hasUnsavedChanges || saving) return;

    // Safety guard: Save must never send an empty absentees list unless the admin actually un-marked people
    if (absenteeIds.size === 0 && initialAbsenteeIds.size === 0) {
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        absentees: Array.from(absenteeIds),
      };
      const res = await api.put(`/sessions/${id}/absentees`, payload);
      setSession(res.data);

      const updatedAbsent = new Set(
        (res.data?.absentees || []).map(toIdString).filter(Boolean)
      );
      setAbsenteeIds(updatedAbsent);
      setInitialAbsenteeIds(new Set(updatedAbsent));

      addToast(
        `Attendance saved successfully (${presentCount} present, ${absentCount} absent).`,
        'success'
      );
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save attendance record';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Compute available filter options
  const availableYears = useMemo(() => {
    const years = new Set();
    members.forEach((m) => {
      if (m.year) years.add(m.year);
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [members]);

  const availableSections = useMemo(() => {
    const sections = new Set();
    members.forEach((m) => {
      if (m.section && m.section.trim()) sections.add(m.section.trim());
    });
    return Array.from(sections).sort();
  }, [members]);

  const totalMembers = members.length;
  // Header counts and row statuses derived from the same single piece of state (absenteeIds)
  const absentCount = useMemo(() => {
    return members.reduce((acc, m) => {
      const mId = toIdString(m);
      return acc + (absenteeIds.has(mId) ? 1 : 0);
    }, 0);
  }, [members, absenteeIds]);
  const presentCount = Math.max(0, totalMembers - absentCount);

  // Filter members by search, year, section
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (selectedYear && String(m.year) !== String(selectedYear)) {
        return false;
      }
      if (
        selectedSection &&
        (m.section || '').trim().toLowerCase() !== selectedSection.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = m.name?.toLowerCase().includes(q);
        const emailMatch = m.email?.toLowerCase().includes(q);
        const secMatch = m.section?.toLowerCase().includes(q);
        const regMatch = m.registerNumber?.toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !secMatch && !regMatch) {
          return false;
        }
      }
      return true;
    });
  }, [members, selectedYear, selectedSection, searchQuery]);

  // Absent members pinned to top, remaining sorted alphabetically below
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      const aId = toIdString(a);
      const bId = toIdString(b);
      const aAbsent = absenteeIds.has(aId);
      const bAbsent = absenteeIds.has(bId);
      if (aAbsent && !bAbsent) return -1;
      if (!aAbsent && bAbsent) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [filteredMembers, absenteeIds]);

  // Format last updated audit text
  const auditText = useMemo(() => {
    if (!session?.attendanceMarkedAt) return null;
    const timeStr = formatIST12Hour(session.attendanceMarkedAt);
    const updaterName =
      (typeof session.attendanceMarkedBy === 'object' && session.attendanceMarkedBy?.name) ||
      session.attendanceMarkedBy ||
      'Coordinator';
    return `Last updated by ${updaterName} at ${timeStr}`;
  }, [session]);

  if (loading) return <Loader fullScreen label="Loading session attendance roster..." />;

  if (error && !session) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto px-4 py-6">
        <button
          type="button"
          onClick={() => handleNavigateAway(`/sessions/${id}`)}
          className="min-h-[48px] px-3 inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Session Details
        </button>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto px-3 sm:px-4 pb-32 sm:pb-36 pt-2">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => handleNavigateAway(`/sessions/${id}`)}
          className="min-h-[48px] px-2 py-2 inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Session Details
        </button>

        <button
          type="button"
          onClick={() => handleNavigateAway(`${basePath}/sessions`)}
          className="min-h-[48px] px-2 py-2 inline-flex items-center text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          All Sessions
        </button>
      </div>

      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-white/[0.07] via-white/[0.03] to-transparent border border-white/10 relative overflow-hidden shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">
                Attendance Roster
              </span>
              {auditText && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono text-zinc-300 bg-white/5 border border-white/10">
                  <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
                  <span className="truncate">{auditText}</span>
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-2xl font-bold font-heading text-white truncate">
              {session?.topic}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
              <span className="flex items-center gap-1 truncate">
                <User className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                <span className="truncate">{session?.handledBy}</span>
              </span>
              <span className="flex items-center gap-1 font-mono shrink-0">
                <Calendar className="w-3.5 h-3.5 text-zinc-300" />
                {session?.date &&
                  new Date(session.date).toLocaleDateString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
              </span>
              {session?.type && (
                <Badge variant={session.type === 'technical' ? 'primary' : 'accent'}>
                  {session.type}
                </Badge>
              )}
            </div>
          </div>

          {/* Header live count pill */}
          <div className="p-2.5 sm:p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 shrink-0 flex items-center justify-center gap-4 self-start sm:self-center">
            <div className="text-center min-w-[50px]">
              <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono leading-none">
                {presentCount}
              </div>
              <div className="text-[9px] uppercase font-mono text-zinc-400 tracking-wider mt-1">
                Present
              </div>
            </div>
            <div className="h-7 w-px bg-white/10" />
            <div className="text-center min-w-[50px]">
              <div className="text-lg sm:text-xl font-bold text-red-400 font-mono leading-none">
                {absentCount}
              </div>
              <div className="text-[9px] uppercase font-mono text-zinc-400 tracking-wider mt-1">
                Absent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Roster Card */}
      <Card className="overflow-hidden p-0 bg-zinc-950 border border-white/10 rounded-2xl shadow-xl">
        {/* Search & Filters Controls */}
        <div className="p-3 sm:p-4 border-b border-white/10 space-y-3 bg-zinc-900/40">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Search Box */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search member, email, reg no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-9 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="h-12 w-9 absolute right-0 top-0 flex items-center justify-center text-zinc-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Year Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-12 px-3 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="">All Years</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full h-12 px-3 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="">All Sections</option>
                {availableSections.map((s) => (
                  <option key={s} value={s}>
                    Section {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter summary and quick action */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <span className="font-mono text-zinc-400">
              Showing {sortedMembers.length} of {totalMembers} members
              {(searchQuery || selectedYear || selectedSection) && ' (filtered)'}
            </span>

            <div className="flex items-center gap-3">
              {(searchQuery || selectedYear || selectedSection) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedYear('');
                    setSelectedSection('');
                  }}
                  className="min-h-[48px] px-2 text-xs font-mono text-amber-400 hover:underline flex items-center"
                >
                  Clear filters
                </button>
              )}
              {absentCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="min-h-[48px] px-2 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-zinc-400" /> Mark all Present
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Member Roster List */}
        <div className="p-2.5 sm:p-4 space-y-2">
          {sortedMembers.length === 0 ? (
            <div className="p-10 text-center text-zinc-500 font-mono text-xs">
              {searchQuery.trim() || selectedYear || selectedSection
                ? 'No approved members match the active filters.'
                : 'No approved members found in club roster.'}
            </div>
          ) : (
            sortedMembers.map((member) => {
              const memberId = toIdString(member);
              const isAbsent = absenteeIds.has(memberId);
              return (
                <div
                  key={memberId}
                  onClick={() => toggleAbsentee(member)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleAbsentee(member);
                    }
                  }}
                  className={`min-h-[56px] p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none flex items-center justify-between gap-3 ${
                    isAbsent
                      ? 'bg-red-500/10 border-red-500/35 hover:bg-red-500/20'
                      : 'bg-zinc-900/60 border-white/5 hover:border-white/20 hover:bg-zinc-900'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isAbsent ? 'text-red-200 line-through opacity-85' : 'text-white'
                        }`}
                      >
                        {member.name}
                      </p>
                      {member.role && member.role !== 'member' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-zinc-200 border border-white/20 shrink-0">
                          {member.role === 'admin'
                            ? 'Admin'
                            : member.role === 'coordinator'
                            ? 'Coordinator'
                            : member.role}
                        </span>
                      )}
                      {member.section && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/10 shrink-0">
                          {member.section}
                        </span>
                      )}
                      {member.year && (
                        <span className="text-[10px] sm:text-[11px] text-zinc-500 font-mono hidden sm:inline">
                          Year {member.year}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-zinc-400 font-mono truncate mt-0.5">
                      {member.email}
                      {member.registerNumber && ` • ${member.registerNumber}`}
                    </p>
                  </div>

                  {/* Status Indicator Pill / Minimum 48px Tap Target */}
                  <div className="shrink-0 flex items-center">
                    {isAbsent ? (
                      <div className="min-h-[48px] flex items-center gap-1.5 px-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold font-mono">
                        <UserX className="w-4 h-4 text-red-400 shrink-0" />
                        <span>Absent</span>
                      </div>
                    ) : (
                      <div className="min-h-[48px] flex items-center gap-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                        <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Present</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Sticky Bottom Bar (Always visible) */}
      <div
        className={`fixed bottom-0 right-0 z-30 bg-zinc-950/95 backdrop-blur-md border-t border-white/10 px-3 sm:px-6 py-3 shadow-2xl transition-all duration-300 left-0 ${
          collapsed ? 'lg:left-20' : 'lg:left-64'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono">
            <span className="text-emerald-400 font-bold">{presentCount} present</span>
            <span className="text-zinc-600">·</span>
            <span className="text-red-400 font-bold">{absentCount} absent</span>
            {hasUnsavedChanges && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">
                Unsaved changes
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={saving}
            disabled={saving || !hasUnsavedChanges || !hasLoaded}
            className="min-h-[48px] h-12 px-5 sm:px-7 text-xs sm:text-sm font-bold bg-white text-black hover:bg-zinc-200 justify-center shadow-lg shrink-0 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Attendance
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionAttendance;
