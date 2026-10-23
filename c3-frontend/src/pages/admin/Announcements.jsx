import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  User,
  Clock,
  MapPin,
  Send,
  Plus,
  Trash2,
  Sparkles,
  Radio,
  Edit3,
  RotateCcw,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Loader } from '../../components/ui/Loader';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const getTodayKolkataDateString = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
};

const formatKolkataDisplayDate = (dateVal) => {
  if (!dateVal) return '';
  return new Date(dateVal).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime12h = (time24) => {
  if (!time24 || typeof time24 !== 'string') return '';
  const trimmed = time24.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return trimmed;
  let h = parseInt(match[1], 10);
  const m = match[2];
  if (isNaN(h)) return trimmed;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

const formatDisplayTime = (time, startTime, endTime) => {
  if (startTime) {
    const s = formatTime12h(startTime);
    if (endTime) {
      return `${s} - ${formatTime12h(endTime)}`;
    }
    return s;
  }
  return time || '';
};

const getRelativeEditedTime = (editedAt) => {
  if (!editedAt) return null;
  const editedDate = new Date(editedAt);
  const diffMs = Date.now() - editedDate.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 0 || diffSec > 86400) return null;
  if (diffSec < 60) return 'Updated just now';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `Updated ${mins} min ago`;
  const hours = Math.floor(mins / 60);
  return `Updated ${hours}h ago`;
};

export const Announcements = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updatingSession, setUpdatingSession] = useState(false);
  const [postingBroadcast, setPostingBroadcast] = useState(false);
  const [testPushLoading, setTestPushLoading] = useState(false);

  const handleSendTestPush = async () => {
    setTestPushLoading(true);
    try {
      const res = await api.post('/notifications/test');
      addToast(
        `Test notification sent! Delivered to ${res.data.result?.sent || 0} registered device(s). Check your phone.`,
        'success'
      );
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send test push notification', 'error');
    } finally {
      setTestPushLoading(false);
    }
  };

  const canDeleteAnnouncement = (item) => {
    if (!item) return false;
    if (user?.role === 'admin') return true;
    const creatorId = item.createdBy?._id || item.createdBy;
    return Boolean(creatorId && String(creatorId) === String(user?._id));
  };

  const todayStr = getTodayKolkataDateString();

  // Peer Session Form State
  const [sessionDate, setSessionDate] = useState(todayStr);
  const [topic, setTopic] = useState('');
  const [handledBy, setHandledBy] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  // Active Live & Upcoming Sessions
  const [todaySession, setTodaySession] = useState(null);
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [broadcasts, setBroadcasts] = useState([]);

  // Quick Action Modal State
  const [activeModal, setActiveModal] = useState(null); // { type: 'venue'|'time'|'cancel', session }
  const [modalVenue, setModalVenue] = useState('');
  const [modalStartTime, setModalStartTime] = useState('');
  const [modalEndTime, setModalEndTime] = useState('');
  const [modalCancelReason, setModalCancelReason] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  // New Broadcast Form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/announcements');
      setTodaySession(res.data.todaySession || null);
      setUpcomingSession(res.data.upcomingSession || null);
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

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !handledBy.trim()) {
      addToast('Topic and Presenter are required', 'warning');
      return;
    }

    try {
      setUpdatingSession(true);
      await api.post('/announcements/today-session', {
        topic: topic.trim(),
        handledBy: handledBy.trim(),
        startTime: startTime ? startTime.trim() : '',
        endTime: endTime ? endTime.trim() : '',
        venue: venue.trim(),
        message: sessionNotes.trim(),
        date: sessionDate || undefined,
      });

      addToast(
        sessionDate === todayStr
          ? "Today's session announcement updated live on overview tab!"
          : `Session scheduled for ${sessionDate}!`,
        'success'
      );
      await fetchAnnouncements();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update session announcement', 'error');
    } finally {
      setUpdatingSession(false);
    }
  };

  const loadSessionIntoForm = (session) => {
    if (!session) return;
    setTopic(session.topic || '');
    setHandledBy(session.handledBy || '');
    setStartTime(session.startTime || '');
    setEndTime(session.endTime || '');
    setVenue(session.venue || '');
    setSessionNotes(session.message || '');
    if (session.date) {
      const dateVal = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date(session.date));
      setSessionDate(dateVal);
    }
    addToast(`Loaded "${session.topic}" into editor`, 'info');
  };

  const handleResetForm = () => {
    setSessionDate(todayStr);
    setTopic('');
    setHandledBy('');
    setStartTime('');
    setEndTime('');
    setVenue('');
    setSessionNotes('');
  };

  const handleDeleteSession = async (id, label = 'Session') => {
    try {
      await api.delete(`/announcements/${id}`);
      addToast(`${label} announcement deleted`, 'info');
      await fetchAnnouncements();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete session announcement', 'error');
    }
  };

  // Quick Action Handlers
  const openVenueModal = (session) => {
    setActiveModal({ type: 'venue', session });
    setModalVenue(session.venue || '');
  };

  const openTimeModal = (session) => {
    setActiveModal({ type: 'time', session });
    setModalStartTime(session.startTime || '');
    setModalEndTime(session.endTime || '');
  };

  const openCancelModal = (session) => {
    setActiveModal({ type: 'cancel', session });
    setModalCancelReason('');
  };

  const handleSaveVenue = async (e) => {
    e.preventDefault();
    if (!activeModal?.session?._id) return;
    try {
      setModalLoading(true);
      await api.patch(`/announcements/${activeModal.session._id}/quick-edit`, {
        venue: modalVenue.trim(),
      });
      addToast('Venue updated successfully!', 'success');
      setActiveModal(null);
      await fetchAnnouncements();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update venue', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleSaveTime = async (e) => {
    e.preventDefault();
    if (!activeModal?.session?._id) return;
    try {
      setModalLoading(true);
      await api.patch(`/announcements/${activeModal.session._id}/quick-edit`, {
        startTime: modalStartTime.trim(),
        endTime: modalEndTime.trim(),
      });
      addToast('Timing updated successfully!', 'success');
      setActiveModal(null);
      await fetchAnnouncements();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update timing', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    if (!activeModal?.session?._id) return;
    try {
      setModalLoading(true);
      await api.patch(`/announcements/${activeModal.session._id}/cancel`, {
        reason: modalCancelReason.trim(),
      });
      addToast('Session marked as Cancelled', 'warning');
      setActiveModal(null);
      await fetchAnnouncements();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to cancel session', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleRestoreSession = async (session) => {
    if (!session?._id) return;
    try {
      await api.patch(`/announcements/${session._id}/restore`);
      addToast('Session restored to Scheduled!', 'success');
      await fetchAnnouncements();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to restore session', 'error');
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

  const handleDeleteBroadcast = async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      setBroadcasts((prev) => prev.filter((b) => b._id !== id));
      addToast('Broadcast announcement deleted', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete broadcast', 'error');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-white bg-white/10 border border-white/15 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Live Dashboard Sync
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Announcement & Session Manager
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage today's active peer session, schedule upcoming sessions by date, and broadcast club announcements in real-time.
          </p>
        </div>

        <button
          onClick={handleSendTestPush}
          disabled={testPushLoading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-900 border border-sky-500/30 text-sky-300 hover:bg-sky-500/10 transition-all flex items-center gap-2 shadow-lg shadow-sky-950/30 active:scale-95 disabled:opacity-50"
          title="Send a test push notification to all your registered devices"
        >
          <Bell className="w-4 h-4 text-sky-400" />
          <span>{testPushLoading ? 'Sending Alert...' : 'Test Phone Alert'}</span>
        </button>
      </div>

      {/* Live Today vs Upcoming Scheduled Session Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Live Today Card */}
        <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Radio className={`w-4 h-4 ${todaySession?.status === 'cancelled' ? 'text-red-400' : todaySession ? 'text-emerald-400 animate-pulse' : 'text-zinc-500'}`} />
                Live Today (Asia/Kolkata)
              </CardTitle>
              {todaySession ? (
                todaySession.status === 'cancelled' ? (
                  <Badge variant="danger">Cancelled</Badge>
                ) : (
                  <Badge variant="success" icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}>
                    Live Today
                  </Badge>
                )
              ) : (
                <Badge variant="warning">No Session Today</Badge>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-3">
              {todaySession ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Topic</span>
                      <h3 className={`text-base font-bold text-white leading-snug ${todaySession.status === 'cancelled' ? 'line-through opacity-75' : ''}`}>
                        {todaySession.topic}
                      </h3>
                    </div>
                    {getRelativeEditedTime(todaySession.editedAt) && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                        {getRelativeEditedTime(todaySession.editedAt)}
                      </span>
                    )}
                  </div>

                  {todaySession.status === 'cancelled' ? (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 leading-relaxed space-y-1">
                      <span className="font-semibold text-red-200 block">Session Cancelled</span>
                      <span>{todaySession.cancelReason || 'No specific cancellation reason provided.'}</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span><strong>Presenter:</strong> {todaySession.handledBy}</span>
                      </div>

                      {todaySession.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span><strong>Time:</strong> {todaySession.time}</span>
                        </div>
                      )}

                      {todaySession.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span><strong>Venue:</strong> {todaySession.venue}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {todaySession.message && todaySession.status !== 'cancelled' && (
                    <p className="text-xs text-zinc-400 bg-zinc-900/80 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                      {todaySession.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 py-4 text-center leading-relaxed">
                  No peer session is active for today ({todayStr}). Schedule or activate one below.
                </p>
              )}
            </CardContent>
          </div>

          {todaySession && (
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-end gap-2">
              {todaySession.status === 'cancelled' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreSession(todaySession)}
                    leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                    className="text-xs text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/40"
                  >
                    Restore
                  </Button>
                  {canDeleteAnnouncement(todaySession) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSession(todaySession._id, "Today's session")}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      className="text-xs text-red-400 hover:text-red-300 hover:border-red-400/40"
                    >
                      Delete
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openVenueModal(todaySession)}
                    leftIcon={<MapPin className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Change venue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTimeModal(todaySession)}
                    leftIcon={<Clock className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Change time
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCancelModal(todaySession)}
                    leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
                    className="text-xs text-amber-400 hover:text-amber-300 hover:border-amber-400/40"
                  >
                    Cancel session
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSessionIntoForm(todaySession)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Edit in form
                  </Button>
                  {canDeleteAnnouncement(todaySession) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSession(todaySession._id, "Today's session")}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      className="text-xs text-red-400 hover:text-red-300 hover:border-red-400/40"
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </Card>

        {/* Upcoming Scheduled Card */}
        <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white" />
                Next Scheduled Session
              </CardTitle>
              {upcomingSession ? (
                upcomingSession.status === 'cancelled' ? (
                  <Badge variant="danger">Cancelled</Badge>
                ) : (
                  <Badge variant="neutral">
                    Scheduled &bull; {new Date(upcomingSession.date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric' })}
                  </Badge>
                )
              ) : (
                <Badge variant="neutral">None Scheduled</Badge>
              )}
            </CardHeader>

            <CardContent className="p-0 pt-4 space-y-3">
              {upcomingSession ? (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                        Date: {formatKolkataDisplayDate(upcomingSession.date)}
                      </span>
                      <h3 className={`text-base font-bold text-white leading-snug mt-0.5 ${upcomingSession.status === 'cancelled' ? 'line-through opacity-75' : ''}`}>
                        {upcomingSession.topic}
                      </h3>
                    </div>
                    {getRelativeEditedTime(upcomingSession.editedAt) && (
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                        {getRelativeEditedTime(upcomingSession.editedAt)}
                      </span>
                    )}
                  </div>

                  {upcomingSession.status === 'cancelled' ? (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300 leading-relaxed space-y-1">
                      <span className="font-semibold text-red-200 block">Session Cancelled</span>
                      <span>{upcomingSession.cancelReason || 'No specific cancellation reason provided.'}</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span><strong>Presenter:</strong> {upcomingSession.handledBy}</span>
                      </div>

                      {upcomingSession.time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span><strong>Time:</strong> {upcomingSession.time}</span>
                        </div>
                      )}

                      {upcomingSession.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span><strong>Venue:</strong> {upcomingSession.venue}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {upcomingSession.message && upcomingSession.status !== 'cancelled' && (
                    <p className="text-xs text-zinc-400 bg-zinc-900/80 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                      {upcomingSession.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 py-4 text-center leading-relaxed">
                  No upcoming peer session is scheduled after today. Pick a future date in the form below to schedule ahead.
                </p>
              )}
            </CardContent>
          </div>

          {upcomingSession && (
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-end gap-2">
              {upcomingSession.status === 'cancelled' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreSession(upcomingSession)}
                    leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                    className="text-xs text-emerald-400 hover:text-emerald-300 hover:border-emerald-400/40"
                  >
                    Restore
                  </Button>
                  {canDeleteAnnouncement(upcomingSession) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSession(upcomingSession._id, 'Upcoming session')}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      className="text-xs text-red-400 hover:text-red-300 hover:border-red-400/40"
                    >
                      Delete
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openVenueModal(upcomingSession)}
                    leftIcon={<MapPin className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Change venue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openTimeModal(upcomingSession)}
                    leftIcon={<Clock className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Change time
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCancelModal(upcomingSession)}
                    leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
                    className="text-xs text-amber-400 hover:text-amber-300 hover:border-amber-400/40"
                  >
                    Cancel session
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSessionIntoForm(upcomingSession)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Edit in form
                  </Button>
                  {canDeleteAnnouncement(upcomingSession) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSession(upcomingSession._id, 'Upcoming session')}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      className="text-xs text-red-400 hover:text-red-300 hover:border-red-400/40"
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Peer Session Form */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-zinc-950/90 border border-white/10 p-5 sm:p-6 shadow-xl">
            <CardHeader className="p-0 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-white" />
                Schedule / Update Peer Session
              </CardTitle>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                title="Reset form"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </CardHeader>

            <form onSubmit={handleUpdateSession} className="space-y-4 pt-4">
              {/* Date Picker */}
              <div className="space-y-1.5">
                <Input
                  label="Session Date (Asia/Kolkata) *"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  required
                />
                <p className="text-[11px] font-mono">
                  {sessionDate === todayStr ? (
                    <span className="text-emerald-400">
                      ● Setting for TODAY ({sessionDate}) &mdash; goes live immediately on Overview tab.
                    </span>
                  ) : sessionDate > todayStr ? (
                    <span className="text-amber-400">
                      ● Scheduling for FUTURE date ({sessionDate}) &mdash; appears as Upcoming, then auto-activates on that day.
                    </span>
                  ) : (
                    <span className="text-zinc-500">
                      ● Past date ({sessionDate}) &mdash; will not appear on member dashboard.
                    </span>
                  )}
                </p>
              </div>

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

              {/* Start & End Time Pickers (Requirement 1 & 2) */}
              <div className="space-y-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Start Time (Optional)"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Input
                    label="End Time (Optional)"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                {startTime && (
                  <p className="text-[11px] font-mono text-zinc-400">
                    Display: <span className="text-white font-medium">{formatDisplayTime('', startTime, endTime)}</span>
                  </p>
                )}
              </div>

              <div>
                <Input
                  label="Venue / Platform (Optional)"
                  type="text"
                  placeholder="e.g. CSE Seminar Hall"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                />
              </div>

              <div>
                <Textarea
                  label="Session Agenda / Key Notes (Optional)"
                  placeholder="Briefly describe what concepts or topics will be explored..."
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
                {updatingSession
                  ? 'Saving...'
                  : sessionDate === todayStr
                  ? "Publish Today's Session"
                  : `Schedule Session for ${sessionDate}`}
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
                    {canDeleteAnnouncement(b) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBroadcast(b._id)}
                        className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors shrink-0"
                        title="Delete broadcast"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Edit Modals (Mobile Friendly) */}
      {/* Change Venue Modal */}
      <Modal
        isOpen={activeModal?.type === 'venue'}
        onClose={() => setActiveModal(null)}
        title="Change Venue / Platform"
        description={`Update location for "${activeModal?.session?.topic}"`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveVenue} className="space-y-4">
          <Input
            label="Venue / Platform"
            type="text"
            placeholder="e.g. CSE Seminar Hall / Room 204"
            value={modalVenue}
            onChange={(e) => setModalVenue(e.target.value)}
            autoFocus
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={modalLoading}
            >
              Save Venue
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Time Modal */}
      <Modal
        isOpen={activeModal?.type === 'time'}
        onClose={() => setActiveModal(null)}
        title="Change Session Timing"
        description={`Update scheduled start & end time for "${activeModal?.session?.topic}"`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveTime} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              type="time"
              value={modalStartTime}
              onChange={(e) => setModalStartTime(e.target.value)}
              autoFocus
            />
            <Input
              label="End Time"
              type="time"
              value={modalEndTime}
              onChange={(e) => setModalEndTime(e.target.value)}
            />
          </div>
          {modalStartTime && (
            <p className="text-xs font-mono text-zinc-400">
              Display preview: <strong className="text-white">{formatDisplayTime('', modalStartTime, modalEndTime)}</strong>
            </p>
          )}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={modalLoading}
            >
              Save Time
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Session Modal */}
      <Modal
        isOpen={activeModal?.type === 'cancel'}
        onClose={() => setActiveModal(null)}
        title="Cancel Session Announcement"
        description={`Are you sure you want to cancel "${activeModal?.session?.topic}"? Members will be notified that the session is cancelled.`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleConfirmCancel} className="space-y-4">
          <Input
            label="Cancellation Reason (Optional)"
            type="text"
            placeholder="e.g. Presenter unwell / CSE Lab unavailable"
            value={modalCancelReason}
            onChange={(e) => setModalCancelReason(e.target.value)}
            autoFocus
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActiveModal(null)}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={modalLoading}
              className="bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
            >
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;
