import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, BookOpen, Calendar, User, UserCheck, Edit, Trash2 } from 'lucide-react';

const Sessions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isStaff = user?.role === 'admin' || user?.role === 'coordinator';
  const isAdmin = user?.role === 'admin';
  const staffBasePath = isAdmin ? '/admin' : '/staff';

  useEffect(() => {
    let isMounted = true;
    const fetchSessions = async () => {
      try {
        const res = await api.get('/sessions');
        if (isMounted) setSessions(res.data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load sessions');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSessions();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (e, sessionId) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm(
      'Are you sure you want to delete this session? This action cannot be undone and will recalculate everyone\'s attendance totals.'
    );
    if (!confirmed) return;

    try {
      await api.delete(`/sessions/${sessionId}`);
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      addToast('Session deleted successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete session', 'error');
    }
  };

  if (loading) return <Loader fullScreen label="Loading daily sessions..." />;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">Daily Sessions</h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">List of all technical and non-technical peer learning sessions</p>
        </div>

        {isStaff && (
          <Link to={`${staffBasePath}/sessions/new`}>
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Session
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-medium text-[#EF4444]">
          {error}
        </div>
      )}

      {sessions.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Sessions Logged Yet"
          description="There are currently no daily sessions recorded in the database."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sessions.map((session) => (
            <Link key={session._id} to={`/sessions/${session._id}`}>
              <Card hoverable className="h-full flex flex-col justify-between overflow-hidden p-0 bg-zinc-950/80 border border-white/10 group">
                <div>
                  <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                    <img
                      src={session.coverImage}
                      alt={session.topic}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <Badge variant={session.type === 'technical' ? 'primary' : 'accent'}>
                        {session.type}
                      </Badge>
                      {session.status === 'cancelled' && (
                        <Badge variant="danger">Cancelled</Badge>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <h3 className="text-base sm:text-lg font-bold font-heading text-white line-clamp-1 group-hover:text-zinc-300 transition-colors">
                      {session.topic}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-zinc-300" /> {session.handledBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-300" />{' '}
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {isStaff && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-3 border-t border-white/5 space-y-2">
                      <Button
                        variant="emerald"
                        size="md"
                        className="w-full min-h-[44px] h-11 px-3.5 text-xs font-semibold rounded-xl whitespace-nowrap justify-center shadow-md shadow-emerald-500/10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`${staffBasePath}/sessions/${session._id}/attendance`);
                        }}
                        leftIcon={<UserCheck className="w-4 h-4 shrink-0 text-white" />}
                      >
                        Mark attendance
                      </Button>

                      <div className={isAdmin ? 'grid grid-cols-2 gap-2 w-full' : 'w-full'}>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full h-9 px-3 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 rounded-xl whitespace-nowrap justify-center"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`${staffBasePath}/sessions/${session._id}/edit`);
                          }}
                          leftIcon={<Edit className="w-3.5 h-3.5 shrink-0 text-zinc-400" />}
                        >
                          Edit
                        </Button>
                        {isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-9 px-3 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 rounded-xl whitespace-nowrap justify-center"
                            onClick={(e) => handleDelete(e, session._id)}
                            leftIcon={<Trash2 className="w-3.5 h-3.5 shrink-0 text-red-400" />}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sessions;

