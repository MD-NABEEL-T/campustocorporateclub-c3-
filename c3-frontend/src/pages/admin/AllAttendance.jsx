import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { FileSpreadsheet, Search, X, ChevronDown, ArrowLeft } from 'lucide-react';

const ATTENDANCE_THRESHOLD = 75;

const AllAttendance = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('lowest');

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

  const renderRoleBadge = (role) => {
    if (!role) return null;
    const normalized = role.toLowerCase();
    if (normalized === 'admin') {
      return (
        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-zinc-300 border border-white/20">
          Admin
        </span>
      );
    }
    if (normalized === 'coordinator') {
      return (
        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-zinc-300 border border-white/20">
          Coordinator
        </span>
      );
    }
    if (normalized !== 'member') {
      return (
        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-zinc-300 border border-white/20">
          {role}
        </span>
      );
    }
    return null;
  };

  const renderAttendanceBadge = (percentage) => {
    if (percentage === null || percentage === undefined) {
      return <Badge variant="neutral">No sessions yet</Badge>;
    }
    if (percentage >= ATTENDANCE_THRESHOLD) {
      return <Badge variant="success">{percentage}%</Badge>;
    }
    return <Badge variant="danger">{percentage}%</Badge>;
  };

  const sortedAndFilteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = members.filter((m) => {
      if (!query) return true;
      const name = (m.name || '').toLowerCase();
      const email = (m.email || '').toLowerCase();
      return name.includes(query) || email.includes(query);
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'lowest') {
        const aNull = a.percentage === null || a.percentage === undefined;
        const bNull = b.percentage === null || b.percentage === undefined;

        // Members with null percentage go last in the attendance sort
        if (aNull && bNull) {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (aNull) return 1;
        if (bNull) return -1;

        if (a.percentage !== b.percentage) {
          return a.percentage - b.percentage;
        }
        return (a.name || '').localeCompare(b.name || '');
      }

      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }

      return 0;
    });
  }, [members, searchQuery, sortBy]);

  if (loading) return <Loader fullScreen label="Loading member attendance matrix..." />;
  if (error)
    return (
      <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium">
        {error}
      </div>
    );

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full">
      <div className="flex items-center gap-3">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="min-h-[44px] h-10 px-3 text-xs" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Admin Overview
          </Button>
        </Link>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#F8FAFC]">Global Attendance Matrix</h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">Attendance breakdown for all approved active members</p>
      </div>

      <Card className="overflow-hidden p-0 bg-zinc-950/80 border border-white/10 rounded-2xl">
        {/* Controls Bar: Member Count + Search + Sort */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/40">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <FileSpreadsheet className="w-4 h-4 text-zinc-300 shrink-0" />
            <span className="truncate">
              Approved Members: {sortedAndFilteredMembers.length}
              {searchQuery.trim() && ` (filtered from ${members.length})`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="relative w-full sm:w-56">
              <select
                id="attendance-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2 pl-3 pr-8 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-white/30 cursor-pointer"
                aria-label="Sort attendance"
              >
                <option value="lowest" className="bg-zinc-900 text-white">Lowest attendance first</option>
                <option value="name" className="bg-zinc-900 text-white">Name A-Z</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Empty State when no members exist */}
        {members.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FileSpreadsheet}
              title="No member attendance data"
              description="There are currently no approved members with attendance records to display."
            />
          </div>
        ) : sortedAndFilteredMembers.length === 0 ? (
          /* Empty Search State */
          <div className="p-8 text-center space-y-2">
            <p className="text-sm text-zinc-400">No members found matching &quot;{searchQuery}&quot;</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-sky-400 hover:text-sky-300 underline font-medium"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <>
            {/* Mobile View: Stacked Cards (< 640px) */}
            <div className="sm:hidden p-3 space-y-3">
              {sortedAndFilteredMembers.map((m) => (
                <div
                  key={m._id}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/10 flex items-start justify-between gap-3 transition-colors hover:bg-zinc-900"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[#F8FAFC] text-sm break-words">{m.name}</span>
                      {renderRoleBadge(m.role)}
                    </div>
                    <p className="text-xs text-[#94A3B8] font-mono truncate mt-0.5" title={m.email}>
                      {m.email}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono mt-2">
                      <span className="text-[#22C55E] font-medium">{m.presentCount} present</span>
                      <span className="text-zinc-600 mx-1.5">·</span>
                      <span className="text-[#EF4444] font-medium">{m.absentCount} absent</span>
                    </p>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    {renderAttendanceBadge(m.percentage)}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto w-full">
              <table className="w-full text-left border-collapse table-auto">
                <thead className="sticky top-0 z-10 bg-zinc-900 border-b border-white/10">
                  <tr className="text-zinc-400 text-xs font-mono uppercase">
                    <th className="py-3 px-4 sm:px-6">Name</th>
                    <th className="py-3 px-4 sm:px-6">Email</th>
                    <th className="py-3 px-4 sm:px-6">Present</th>
                    <th className="py-3 px-4 sm:px-6">Absent</th>
                    <th className="py-3 px-4 sm:px-6">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {sortedAndFilteredMembers.map((m) => (
                    <tr key={m._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#F8FAFC]">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{m.name}</span>
                          {renderRoleBadge(m.role)}
                        </div>
                      </td>
                      <td
                        className="py-3.5 px-4 sm:px-6 text-[#94A3B8] font-mono text-xs truncate max-w-[240px]"
                        title={m.email}
                      >
                        {m.email}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-[#22C55E] font-medium">
                        {m.presentCount}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-[#EF4444] font-medium">
                        {m.absentCount}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        {renderAttendanceBadge(m.percentage)}
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
  );
};

export default AllAttendance;
