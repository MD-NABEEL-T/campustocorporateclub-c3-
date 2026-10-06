import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { ArrowLeft, Calendar, User } from 'lucide-react';

const SessionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      try {
        const res = await api.get(`/sessions/${id}`);
        if (isMounted) setSession(res.data);
      } catch (err) {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load session details');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSession();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Loader fullScreen label="Loading session record..." />;
  if (error)
    return (
      <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm font-medium">
        {error}
      </div>
    );
  if (!session) return null;

  return (
    <div className="space-y-6">
      <Link to="/sessions">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Sessions
        </Button>
      </Link>

      <Card className="overflow-hidden p-0 bg-zinc-950/80 border border-white/10">
        <div className="relative h-60 sm:h-72 w-full bg-zinc-900">
          <img
            src={session.coverImage}
            alt={session.topic}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge variant={session.type === 'technical' ? 'primary' : 'accent'}>
              {session.type}
            </Badge>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {session.topic}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-zinc-400 mt-2">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-300" /> Handled by {session.handledBy}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-300" />{' '}
                {new Date(session.date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {session.summary && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-xs font-mono uppercase text-zinc-400 mb-2 font-semibold tracking-wider">
                Session Summary Notes
              </h4>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed whitespace-pre-line">
                {session.summary}
              </p>
            </div>
          )}

          {session.images?.length > 0 && (
            <div className="border-t border-white/10 pt-6">
              <h4 className="text-xs font-mono uppercase text-zinc-400 mb-4 font-semibold tracking-wider">
                Session Photos Archive
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {session.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${session.topic} photo ${i + 1}`}
                    className="w-full h-28 sm:h-36 object-cover rounded-xl border border-white/10"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SessionDetail;

