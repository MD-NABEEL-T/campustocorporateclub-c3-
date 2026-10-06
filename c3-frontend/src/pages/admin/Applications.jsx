import { useState, useEffect } from 'react';
import { Send, FileText, ExternalLink, Mail, Phone, Link as LinkIcon, Globe, Image as ImageIcon, Search, Filter, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { DOMAIN_OPTIONS } from '../../constants/domains';

const STATUS_FILTERS = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const SECTION_FILTERS = [
  { value: '', label: 'All Sections' },
  { value: 'CSE A', label: 'CSE - Section A' },
  { value: 'CSE B', label: 'CSE - Section B' },
  { value: 'Other', label: 'Other Sections' },
];

const STATUS_BADGE = {
  draft: { variant: 'neutral', label: 'Draft' },
  pending: { variant: 'primary', label: 'Pending' },
  shortlisted: { variant: 'warning', label: 'Shortlisted' },
  accepted: { variant: 'success', label: 'Accepted' },
  rejected: { variant: 'danger', label: 'Rejected' },
};

const domainLabel = (value) => DOMAIN_OPTIONS.find((d) => d.value === value)?.label || value || '-';

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const Applications = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/applications', {
          params: statusFilter ? { status: statusFilter } : undefined,
        });
        if (isMounted) setApplications(res.data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchApplications();
    return () => {
      isMounted = false;
    };
  }, [statusFilter]);

  const filteredApplications = applications.filter((app) => {
    if (sectionFilter && app.section !== sectionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = app.fullName?.toLowerCase().includes(q);
      const matchEmail = app.collegeEmail?.toLowerCase().includes(q);
      const matchReg = app.registerNumber?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchReg) return false;
    }
    return true;
  });

  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const openDetail = async (id) => {
    try {
      const res = await api.get(`/applications/${id}`);
      setSelected(res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load application', 'error');
    }
  };

  const updateStatus = async (newStatus) => {
    if (!selected) return;
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/applications/${selected._id}/status`, { status: newStatus });
      setSelected(res.data);
      setApplications((prev) => prev.map((a) => (a._id === res.data._id ? res.data : a)));
      addToast(`Status marked as ${newStatus}`, 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading junior recruitment applications..." />;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Junior Hiring Applications</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review recruitment applications submitted by junior students (CSE A & CSE B).
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-40 sm:w-48">
            <Select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              options={SECTION_FILTERS}
            />
          </div>
          <div className="w-40 sm:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={STATUS_FILTERS}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Metrics Badges */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {Object.entries(STATUS_BADGE)
          .filter(([k]) => k !== 'draft')
          .map(([status, cfg]) => (
            <Badge key={status} variant={cfg.variant}>
              {cfg.label}: {counts[status] || 0}
            </Badge>
          ))}
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden p-0 bg-zinc-950 border border-white/10 rounded-2xl">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/40">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Send className="w-4 h-4 text-white" />
            <span>Total Applicants: {filteredApplications.length}</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, reg no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 font-mono text-xs">
            No junior applications match your current filters.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 text-xs font-mono uppercase bg-zinc-900/60">
                  <th className="py-3.5 px-4 sm:px-6">Applicant Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Section</th>
                  <th className="py-3.5 px-4 sm:px-6">Year</th>
                  <th className="py-3.5 px-4 sm:px-6">Domain</th>
                  <th className="py-3.5 px-4 sm:px-6">ID Card</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredApplications.map((app) => {
                  const statusCfg = STATUS_BADGE[app.status] || STATUS_BADGE.pending;
                  return (
                    <tr
                      key={app._id}
                      onClick={() => openDetail(app._id)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 sm:px-6 font-semibold text-white">
                        <div>{app.fullName || 'Anonymous'}</div>
                        <div className="text-xs text-zinc-500 font-mono mt-0.5">{app.collegeEmail}</div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-zinc-300">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono">
                          {app.section || 'CSE A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-zinc-400 text-xs">{app.year ? `Year ${app.year}` : '-'}</td>
                      <td className="py-4 px-4 sm:px-6 text-zinc-300 text-xs font-medium">
                        {domainLabel(app.preferredDomain)}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        {app.idCardUrl ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                            <ImageIcon className="w-3.5 h-3.5" /> Attached
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500 font-mono">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-zinc-400 text-xs font-mono">
                        {formatDate(app.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Applicant Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.fullName || 'Applicant Profile'}
        description={selected ? `Applied on ${formatDate(selected.createdAt)}` : ''}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-6 text-zinc-300">
            {/* Status header */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-900 border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">Current Status:</span>
                <Badge variant={(STATUS_BADGE[selected.status] || STATUS_BADGE.pending).variant}>
                  {(STATUS_BADGE[selected.status] || STATUS_BADGE.pending).label}
                </Badge>
              </div>
              <span className="text-xs font-mono text-white px-2.5 py-1 rounded bg-white/10 border border-white/15">
                {selected.section || 'CSE A'}
              </span>
            </div>

            {/* ID Card Photo Preview */}
            {selected.idCardUrl && (
              <div className="space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">College ID Card Photo</p>
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-black p-2">
                  <a href={selected.idCardUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={selected.idCardUrl}
                      alt="College ID Card"
                      className="max-h-64 w-full object-contain rounded-xl hover:opacity-95 transition-opacity"
                    />
                  </a>
                  <div className="text-center pt-2">
                    <a
                      href={selected.idCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> View full resolution
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Applicant Grid Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Detail icon={Mail} label="College Email" value={selected.collegeEmail} />
              <Detail icon={Phone} label="Phone Number" value={selected.phone} />
              <Detail label="Section" value={selected.section} />
              <Detail label="Academic Year" value={selected.year ? `Year ${selected.year}` : '-'} />
              <Detail label="Register Number" value={selected.registerNumber} />
              <Detail label="Primary Domain" value={domainLabel(selected.preferredDomain)} />
            </div>

            {/* Why Join Response */}
            {selected.whyJoin && (
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Why You Want to Join C3</p>
                <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{selected.whyJoin}</p>
              </div>
            )}

            {/* Skills */}
            {selected.skills && (
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1.5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Skills & Knowledge</p>
                <p className="text-sm text-white leading-relaxed">{selected.skills}</p>
              </div>
            )}

            {/* External Links */}
            <div className="flex flex-wrap gap-2">
              {selected.portfolioUrl && <LinkChip icon={Globe} label="Portfolio" url={selected.portfolioUrl} />}
              {selected.githubUrl && <LinkChip icon={LinkIcon} label="GitHub" url={selected.githubUrl} />}
              {selected.linkedinUrl && <LinkChip icon={LinkIcon} label="LinkedIn" url={selected.linkedinUrl} />}
              {selected.resumeUrl && <LinkChip icon={FileText} label="Resume" url={selected.resumeUrl} />}
            </div>

            {/* Admin Status Updater */}
            {user?.role === 'admin' && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Update Application Decision
                </p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'shortlisted', 'accepted', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      type="button"
                      size="sm"
                      variant={selected.status === status ? 'primary' : 'ghost'}
                      disabled={updatingStatus || selected.status === status}
                      onClick={() => updateStatus(status)}
                      className={`text-xs capitalize ${
                        selected.status === status ? 'bg-white text-black font-semibold' : 'border border-white/10'
                      }`}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const Detail = ({ icon: Icon, label, value }) => (
  <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5">
    <p className="text-[10px] font-mono uppercase tracking-wide text-zinc-400 flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" />} {label}
    </p>
    <p className="text-white font-medium truncate mt-0.5">{value || '—'}</p>
  </div>
);

const LinkChip = ({ icon: Icon, label, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 text-white border border-white/15 hover:bg-white/10 transition-colors"
  >
    <Icon className="w-3.5 h-3.5" /> {label} <ExternalLink className="w-3 h-3" />
  </a>
);

export default Applications;