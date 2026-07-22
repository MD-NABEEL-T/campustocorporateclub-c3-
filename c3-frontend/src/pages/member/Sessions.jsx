import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { EmptyState } from '../../components/ui/EmptyState';
import { Plus, BookOpen, Calendar, User } from 'lucide-react';

const Sessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/api/sessions', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setSessions(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [user.token]);

  if (loading) return <Loader fullScreen label="Loading daily sessions..." />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-[#F8FAFC]">Daily Sessions</h2>
          <p className="text-sm text-[#94A3B8]">List of all technical and non-technical peer learning sessions</p>
        </div>

        {user.role === 'admin' && (
          <Link to="/admin/sessions/new">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <Link key={session._id} to={`/sessions/${session._id}`}>
              <Card hoverable className="h-full flex flex-col justify-between overflow-hidden p-0">
                <div>
                  <div className="relative h-44 w-full bg-[#071A2B] overflow-hidden">
                    <img
                      src={session.coverImage}
                      alt={session.topic}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant={session.type === 'technical' ? 'primary' : 'accent'}>
                        {session.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold font-heading text-[#F8FAFC] line-clamp-1">
                      {session.topic}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#38BDF8]" /> {session.handledBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#2DD4BF]" />{' '}
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
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
