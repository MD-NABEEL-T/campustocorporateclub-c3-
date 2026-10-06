import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Calendar,
  User,
  Clock,
  MapPin,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

export const Announcements = () => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updatingSession, setUpdatingSession] = useState(false);
  const [postingBroadcast, setPostingBroadcast] = useState(false);

  // Today's Session Form
  const [topic, setTopic] = useState('');
  const [handledBy, setHandledBy] = useState('');
  const [time, setTime] = useState('4:30 PM - 5:00 PM (30 Mins)');
  const [venue, setVenue] = useState('CSE Seminar Hall');
  const [sessionNotes, setSessionNotes] = useState('');

  // Active Data
  const [activeSession, setActiveSession] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);

  // New Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/announcements');
      if (res.data.todaySession) {
        setActiveSession(res.data.todaySession);
        setTopic(res.data.todaySession.topic || '');
        setHandledBy(res.data.todaySession.handledBy || '');
        setTime(res.data.todaySession.time || '4:30 PM - 5:00 PM (30 Mins)');
        setVenue(res.data.todaySession.venue || 'CSE Seminar Hall');
        setSessionNotes(res.data.todaySession.message || '');
      }
      setBroadcasts(res.data.broadcasts || []);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleUpdateTodaySession = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !handledBy.trim()) {
      addToast('Topic and Presenter are required', 'warning');
      return;
    }

    try {
      setUpdatingSession(true);
      const res = await api.post('/announcements/today-session', {
        topic: topic.trim(),
        handledBy: handledBy.trim(),
        time: time.trim(),
        venue: venue.trim(),
        message: sessionNotes.trim(),
      });

      setActiveSession(res.data.sessionAnnouncement);
      addToast("Today's Session announcement updated live on overview tab!", 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update session announcement', 'error');
    } finally {
      setUpdatingSession(false);
    }
  };

  const handleCreateBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      addToast('Title and message are required', 'warning');
      return;
    }

    try {
      setPostingBroadcast(true);
      const res = await api.post('/announcements/broadcast', {
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
      });

      setBroadcasts((prev) => [res.data.broadcast, ...prev]);
      setBroadcastTitle('');
      setBroadcastMessage('');
      addToast('Broadcast announcement published!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to post broadcast', 'error');
    } finally {
      setPostingBroadcast(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setBroadcasts((prev) => prev.filter((b) => b._id !== id));
      addToast('Announcement deleted', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete announcement', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader size="lg" label="Loading announcement manager..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-white bg-white/10 border border-white/15 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Live Dashboard Sync
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
          Announcement & Session Manager
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Update today's peer session details and broadcast club announcements to all C3 members in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Today's Peer Session Updater */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl">
            <CardHeader className="p-0 pb-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white" />
                  Today's Peer Session (30 Min)
                </CardTitle>
                <Badge variant="default">Live on Overview</Badge>
              </div>
            </CardHeader>

            <form onSubmit={handleUpdateTodaySession} className="space-y-4 pt-4">
              <div>
                <Input
                  label="Session Topic *"
                  type="text"
                  placeholder="e.g. Distributed Caching & Redis Architecture"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>

              <div>
                <Input
                  label="Handled By / Presenter Name *"
                  type="text"
                  placeholder="e.g. Ashfaq Ahmed (President)"
                  value={handledBy}
                  onChange={(e) => setHandledBy(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Timing (30 Mins)"
                  type="text"
                  placeholder="4:30 PM - 5:00 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <Input
                  label="Venue / Platform"
                  type="text"
                  placeholder="CSE Seminar Hall"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              <div>
                <Textarea
                  label="Session Agenda / Key Notes"
                  placeholder="Briefly describe what concepts or topics will be explored today..."
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
                isLoading={updatingSession}
                leftIcon={<Send className="w-4 h-4" />}
              >
                {updatingSession ? 'Updating Live Session...' : "Update Today's Session"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Broadcast Feed */}
        <div className="lg:col-span-6 space-y-6">
          {/* Post Broadcast Card */}
          <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl">
            <CardHeader className="p-0 pb-4 border-b border-white/10">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-white" />
                Post New Broadcast
              </CardTitle>
            </CardHeader>

            <form onSubmit={handleCreateBroadcast} className="space-y-4 pt-4">
              <div>
                <Input
                  label="Broadcast Title *"
                  type="text"
                  placeholder="e.g. Department Coding Sprint Tomorrow"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Textarea
                  label="Broadcast Message *"
                  placeholder="Write the official announcement message for club members..."
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center"
                isLoading={postingBroadcast}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                {postingBroadcast ? 'Publishing...' : 'Publish Broadcast'}
              </Button>
            </form>
          </Card>

          {/* Broadcasts List */}
          <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl">
            <CardHeader className="p-0 pb-3 border-b border-white/10">
              <CardTitle className="text-base font-bold text-white">
                Recent Broadcast Feed ({broadcasts.length})
              </CardTitle>
            </CardHeader>

            <div className="pt-3 divide-y divide-white/5 max-h-72 overflow-y-auto pr-1">
              {broadcasts.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">
                  No broadcast announcements posted yet.
                </p>
              ) : (
                broadcasts.map((b) => (
                  <div key={b._id} className="py-3 flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white truncate">{b.title}</p>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{b.message}</p>
                      <p className="text-[10px] font-mono text-zinc-500">
                        {new Date(b.createdAt || b.date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(b._id)}
                      className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors shrink-0"
                      title="Delete broadcast"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
