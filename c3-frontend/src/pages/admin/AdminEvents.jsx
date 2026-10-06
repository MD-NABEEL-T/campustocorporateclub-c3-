import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';

export const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [currentCoverUrl, setCurrentCoverUrl] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setSlug('');
    setCategory('Workshop');
    setDate(new Date().toISOString().split('T')[0]);
    setAttendeeCount('');
    setDescription('');
    setSummary('');
    setCoverImage(null);
    setGallery([]);
    setCurrentCoverUrl('');
    setError('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setTitle(event.title || '');
    setSlug(event.slug || '');
    setCategory(event.category || '');
    setDate(event.date ? event.date.split('T')[0] : '');
    setAttendeeCount(event.attendeeCount ? String(event.attendeeCount) : '');
    setDescription(event.description || '');
    setSummary(event.summary || '');
    setCoverImage(null);
    setGallery([]);
    setCurrentCoverUrl(event.coverImage || '');
    setError('');
    setSuccessMsg('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!editingEvent && !coverImage) {
      setError('Cover image is required for new events');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      if (slug) formData.append('slug', slug);
      if (category) formData.append('category', category);
      if (date) formData.append('date', date);
      if (attendeeCount) formData.append('attendeeCount', attendeeCount);
      formData.append('description', description);
      if (summary) formData.append('summary', summary);
      if (coverImage) formData.append('coverImage', coverImage);
      gallery.forEach((img) => formData.append('gallery', img));

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMsg(`Event "${title}" updated successfully!`);
      } else {
        await api.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMsg(`Event "${title}" created successfully!`);
      }

      closeModal();
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (event) => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      await api.delete(`/events/${event._id}`);
      setEvents(events.filter((e) => e._id !== event._id));
      setSuccessMsg(`Event "${event.title}" deleted.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Events Management</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Create, edit, and update C3 technical symposiums, hackathons, and guest sessions.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          leftIcon={<Plus className="w-4 h-4" />}
          className="bg-white text-black hover:bg-zinc-200 transition-colors font-semibold"
        >
          Add New Event
        </Button>
      </div>

      {/* Notification banners */}
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

      {error && !isModalOpen && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Events Grid */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 font-mono text-xs">Loading events...</div>
      ) : events.length === 0 ? (
        <Card className="bg-zinc-950 border border-white/10 p-10 text-center rounded-2xl">
          <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No Events Published Yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            Click the button above to publish your first department event.
          </p>
          <Button variant="primary" onClick={openCreateModal} className="bg-white text-black hover:bg-zinc-200">
            Create Event
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <Card
              key={event._id}
              className="bg-zinc-950 border border-white/10 hover:border-white/20 transition-all rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Event Cover Image */}
                <div className="relative aspect-[16/9] w-full bg-zinc-900 overflow-hidden">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.title}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  {event.category && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white font-semibold">
                      {event.category}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-xs text-zinc-400 font-mono">
                    {event.date ? new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date TBA'}
                  </div>
                  <h3 className="text-lg font-bold font-heading text-white line-clamp-1">{event.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{event.description}</p>

                  {event.attendeeCount && (
                    <div className="pt-2 flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                      <Users className="w-3.5 h-3.5" />
                      <span>{event.attendeeCount} Attendees</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-zinc-900/50 border-t border-white/5 flex items-center justify-between gap-2">
                <Link
                  to={`/events/${event.slug || event._id}`}
                  target="_blank"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Page
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(event)}
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                    className="text-xs text-white hover:bg-white/10"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(event)}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    className="text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-xl font-bold font-heading text-white">
                {editingEvent ? `Edit Event: ${editingEvent.title}` : 'Create New Event'}
              </h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Event Title"
                type="text"
                placeholder="e.g. IDC Nexus 2026 Symposium"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Category"
                  type="text"
                  placeholder="e.g. Hackathon, Workshop, Symposium"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />

                <Input
                  label="Event Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Custom Slug (Optional)"
                  type="text"
                  placeholder="e.g. idc-nexus-2026"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />

                <Input
                  label="Participant / Attendee Count"
                  type="number"
                  placeholder="e.g. 150"
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(e.target.value)}
                />
              </div>

              <Textarea
                label="Short Description"
                placeholder="One or two paragraphs introducing the event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <Textarea
                label="Full Event Report / Summary (Optional)"
                placeholder="Detailed event recap, prize winners, session outcomes..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Cover Image {editingEvent ? '(Leave blank to keep existing)' : '(Required)'}
                </label>
                {currentCoverUrl && (
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-900 border border-white/10 mb-2">
                    <img
                      src={currentCoverUrl}
                      alt="Current Cover"
                      className="w-16 h-10 object-cover rounded-lg"
                    />
                    <span className="text-xs text-zinc-400 truncate">Current: {currentCoverUrl}</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer"
                  required={!editingEvent}
                />
              </div>

              {/* Gallery Photos */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Event Gallery Photos (Optional, up to 6)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGallery(Array.from(e.target.files).slice(0, 6))}
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={closeModal} className="text-zinc-400 hover:text-white">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                  className="bg-white text-black hover:bg-zinc-200 font-semibold"
                >
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
