import { useState, useEffect } from 'react';
import { Send, FileText, ExternalLink, Mail, Phone, Link, Link2, Globe } from 'lucide-react';
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
  { value: 'draft', label: 'Draft / Incomplete' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
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
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const Applications = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const authHeaders = { headers: { Authorization: `Bearer ${user.token}` } };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/applications', {
          headers: { Authorization: `Bearer ${user.token}` },
          params: statusFilter ? { status: statusFilter } : undefined,
        });
        setApplications(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [statusFilter, user.token]);

  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const openDetail = async (id) => {
    try {
      const res = await api.get(`/applications/${id}`, authHeaders);
      setSelected(res.data);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load application', 'error');
    }
  };

  const updateStatus = async (newStatus) => {
    if (!selected) return;
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/applications/${selected._id}/status`, { status: newStatus }, authHeaders);
      setSelected(res.data);
      setApplications((prev) => prev.map((a) => (a._id === res.data._id ? res.data : a)));
      addToast('Status updated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading applications..." />;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">Junior Applications</h2>
          <p className="text-sm text-[#94A3B8]">
            Review recruitment applications, including drafts applicants haven't finished yet.
          </p>
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={STATUS_FILTERS}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {Object.entries(STATUS_BADGE).map(([status, cfg]) => (
          <Badge key={status} variant={cfg.variant}>
            {cfg.label}: {counts[status] || 0}
          </Badge>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#071A2B]/40">
          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8]">
            <Send className="w-4 h-4 text-[#38BDF8]" /> Total: {applications.length}
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#94A3B8]">No applications match this filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[#94A3B8] text-xs font-mono uppercase bg-[#071A2B]/80">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">College Email</th>
                  <th className="py-3 px-6">Department</th>
                  <th className="py-3 px-6">Year</th>
                  <th className="py-3 px-6">Domain</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {applications.map((app) => {
                  const statusCfg = STATUS_BADGE[app.status] || STATUS_BADGE.pending;
                  return (
                    <tr
                      key={app._id}
                      onClick={() => openDetail(app._id)}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-6 font-semibold text-[#F8FAFC]">
                        {app.fullName || <span className="text-[#94A3B8] italic">Not entered yet</span>}
                      </td>
                      <td className="py-3.5 px-6 text-[#94A3B8] font-mono text-xs">
                        {app.collegeEmail || <span className="italic">Not entered yet</span>}
                      </td>
                      <td className="py-3.5 px-6 text-[#94A3B8]">{app.department || '-'}</td>
                      <td className="py-3.5 px-6 text-[#94A3B8]">{app.year || '-'}</td>
                      <td className="py-3.5 px-6 text-[#94A3B8]">{domainLabel(app.preferredDomain)}</td>
                      <td className="py-3.5 px-6">
                        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
                      </td>
                      <td className="py-3.5 px-6 text-[#94A3B8] text-xs font-mono">
                        {formatDate(app.updatedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.fullName || 'Application'}
        description={selected ? `Applied ${formatDate(selected.createdAt)}` : ''}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={(STATUS_BADGE[selected.status] || STATUS_BADGE.pending).variant}>
                {(STATUS_BADGE[selected.status] || STATUS_BADGE.pending).label}
              </Badge>
              {selected.status === 'draft' && (
                <span className="text-xs text-[#94A3B8]">
                  This applicant hasn't submitted yet - status can't be changed until they do.
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Detail icon={Mail} label="College Email" value={selected.collegeEmail} />
              <Detail icon={Mail} label="Personal Email" value={selected.personalEmail} />
              <Detail icon={Phone} label="Phone" value={selected.phone} />
              <Detail label="Department" value={selected.department} />
              <Detail label="Year" value={selected.year} />
              <Detail label="Register Number" value={selected.registerNumber} />
              <Detail label="Preferred Domain" value={domainLabel(selected.preferredDomain)} />
              <Detail label="Secondary Domain" value={domainLabel(selected.secondaryDomain)} />
            </div>

            {selected.skills && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wide text-[#94A3B8] mb-1">Skills</p>
                <p className="text-sm text-[#F8FAFC]">{selected.skills}</p>
              </div>
            )}
            {selected.experience && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wide text-[#94A3B8] mb-1">Experience</p>
                <p className="text-sm text-[#F8FAFC]">{selected.experience}</p>
              </div>
            )}
            {selected.whyJoin && (
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wide text-[#94A3B8] mb-1">Why Join C3</p>
                <p className="text-sm text-[#F8FAFC]">{selected.whyJoin}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {selected.portfolioUrl && <LinkChip icon={Globe} label="Portfolio" url={selected.portfolioUrl} />}
              {selected.githubUrl && <LinkChip icon={Link} label="GitHub" url={selected.githubUrl} />}
              {selected.linkedinUrl && <LinkChip icon={Link2} label="LinkedIn" url={selected.linkedinUrl} />}
              {selected.resumeUrl && <LinkChip icon={FileText} label="Resume" url={selected.resumeUrl} />}
            </div>

            {selected.status !== 'draft' && (
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wide text-[#94A3B8] mb-2">
                  Update Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'shortlisted', 'accepted', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      type="button"
                      size="sm"
                      variant={selected.status === status ? 'accent' : 'outline'}
                      disabled={updatingStatus || selected.status === status}
                      onClick={() => updateStatus(status)}
                    >
                      {STATUS_BADGE[status].label}
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
  <div className="p-3 rounded-lg bg-[#071A2B]/60 border border-white/5">
    <p className="text-[10px] font-mono uppercase tracking-wide text-[#94A3B8] flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" />} {label}
    </p>
    <p className="text-[#F8FAFC] font-medium truncate">{value || '-'}</p>
  </div>
);

const LinkChip = ({ icon: Icon, label, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#38BDF8]/20 transition-colors"
  >
    <Icon className="w-3.5 h-3.5" /> {label} <ExternalLink className="w-3 h-3" />
  </a>
);

export default Applications;