import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';

const EventForm = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [attendeeCount, setAttendeeCount] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setCategory('');
    setDate('');
    setAttendeeCount('');
    setDescription('');
    setSummary('');
    setCoverImage(null);
    setGallery([]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setCreated(null);

    if (!coverImage) {
      setError('Cover image is required');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (slug) formData.append('slug', slug);
      if (category) formData.append('category', category);
      formData.append('date', date);
      if (attendeeCount) formData.append('attendeeCount', attendeeCount);
      formData.append('description', description);
      if (summary) formData.append('summary', summary);
      formData.append('coverImage', coverImage);
      gallery.forEach(img => formData.append('gallery', img));

      const res = await api.post('/api/events', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setCreated(res.data);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Admin Overview
        </Button>
      </Link>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 mb-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-medium text-[#EF4444]">
              {error}
            </div>
          )}

          {created && (
            <div className="p-3 mb-4 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs font-medium text-[#22C55E] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                "{created.title}" created (slug: {created.slug}). It's now live at{' '}
                <code>GET /api/public/events</code>.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Event Title"
              type="text"
              placeholder="e.g. Hackathon & Debate"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <Input
              label="Slug (optional - auto-generated from title if left blank)"
              type="text"
              placeholder="e.g. hackathon"
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />

            <Input
              label="Category"
              type="text"
              placeholder="e.g. Hackathon, Workshop, Session, Sprint"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />

            <Input label="Event Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />

            <Input
              label="Participant Count"
              type="number"
              placeholder="e.g. 120"
              value={attendeeCount}
              onChange={e => setAttendeeCount(e.target.value)}
            />

            <Textarea
              label="Short Description"
              placeholder="One or two lines describing the event..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />

            <Textarea
              label="Full Summary (optional)"
              placeholder="Longer write-up / report of the event..."
              value={summary}
              onChange={e => setSummary(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Cover Image (Required)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setCoverImage(e.target.files[0])}
                className="w-full text-xs text-[#94A3B8] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#38BDF8]/10 file:text-[#38BDF8] hover:file:bg-[#38BDF8]/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Gallery Photos (optional, up to 6)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={e => setGallery(Array.from(e.target.files).slice(0, 6))}
                className="w-full text-xs text-[#94A3B8] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2DD4BF]/10 file:text-[#2DD4BF] hover:file:bg-[#2DD4BF]/20"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={submitting}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Publish Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;