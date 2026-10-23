import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { ArrowLeft, Plus, Save, Image as ImageIcon } from 'lucide-react';

const formatDateForInput = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
};

const SessionForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('technical');
  const [status, setStatus] = useState('held');
  const [handledBy, setHandledBy] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);
  const [existingCoverImage, setExistingCoverImage] = useState('');
  const [existingImages, setExistingImages] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // In edit mode, fetch current session details
  useEffect(() => {
    if (!isEdit) return;

    let isMounted = true;
    const fetchSession = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/sessions/${id}`);
        if (isMounted) {
          const s = res.data;
          setTopic(s.topic || '');
          setHandledBy(s.handledBy || '');
          setType(s.type || 'technical');
          setStatus(s.status || 'held');
          setSummary(s.summary || '');
          setDate(formatDateForInput(s.date));
          setExistingCoverImage(s.coverImage || '');
          setExistingImages(s.images || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load session details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSession();
    return () => {
      isMounted = false;
    };
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEdit && !coverImage) {
      setError('Cover image is required');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('date', date);
      formData.append('topic', topic);
      formData.append('type', type);
      formData.append('handledBy', handledBy);
      formData.append('summary', summary);
      if (isEdit) {
        formData.append('status', status);
      }

      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      if (images.length > 0) {
        images.forEach((img) => formData.append('images', img));
      }

      if (isEdit) {
        await api.put(`/sessions/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        addToast('Session updated successfully', 'success');
        navigate(`/sessions/${id}`);
      } else {
        const res = await api.post('/sessions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        addToast('Session created successfully', 'success');
        const basePath = user?.role === 'admin' ? '/admin' : '/staff';
        navigate(`${basePath}/sessions/${res.data._id}/attendance`);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} session`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading session data for editing..." />;
  }

  const basePath = user?.role === 'admin' ? '/admin' : '/staff';

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <Link to={isEdit ? `/sessions/${id}` : `${basePath}/sessions`}>
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          {isEdit ? 'Back to Session Details' : 'Back to Sessions'}
        </Button>
      </Link>

      <Card className="bg-zinc-950/80 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-xl">
        <CardHeader className="p-0 pb-6 border-b border-white/10">
          <CardTitle className="text-xl sm:text-2xl font-bold font-heading text-white">
            {isEdit ? 'Edit Session Record' : 'Log New Daily Session'}
          </CardTitle>
          <p className="text-xs text-zinc-400 mt-1">
            {isEdit
              ? 'Update session presenter, topic, schedule date, notes, or status'
              : 'Record a technical or non-technical peer learning session'}
          </p>
        </CardHeader>

        <CardContent className="p-0 pt-6">
          {error && (
            <div className="p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Session Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Input
              label="Presentation Topic"
              type="text"
              placeholder="e.g. System Design Basics & Caching"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />

            <div className={`grid grid-cols-1 ${isEdit ? 'sm:grid-cols-2' : ''} gap-4`}>
              <Select
                label="Session Track Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={[
                  { value: 'technical', label: 'Technical Track' },
                  { value: 'non-technical', label: 'Non-Technical Track' },
                ]}
              />

              {isEdit && (
                <Select
                  label="Session Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  options={[
                    { value: 'held', label: 'Held (Active turnout)' },
                    { value: 'cancelled', label: 'Cancelled (Excluded from attendance)' },
                  ]}
                />
              )}
            </div>

            <Input
              label="Handled By / Presenter Name"
              type="text"
              placeholder="e.g. Nabeel (Core Lead)"
              value={handledBy}
              onChange={(e) => setHandledBy(e.target.value)}
              required
            />

            <Textarea
              label="Session Summary & Key Notes"
              placeholder="Provide a detailed summary of key concepts covered during the presentation..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
            />

            {/* Cover Image Upload & Current Preview */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {isEdit ? 'Cover Image (Optional to Replace)' : 'Cover Image (Required)'}
              </label>

              {isEdit && existingCoverImage && !coverImage && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5 mb-2">
                  <img
                    src={existingCoverImage}
                    alt="Current cover"
                    className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <div className="text-xs text-zinc-400">
                    <span className="text-white font-medium block">Current cover photo</span>
                    <span className="text-[11px] text-zinc-500">
                      Select a new file below to replace it, or leave empty to keep it.
                    </span>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0] || null)}
                className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                required={!isEdit && !existingCoverImage}
              />
            </div>

            {/* Gallery Photos Upload & Current Preview */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {isEdit
                  ? 'Gallery Photos (Optional, replaces existing gallery)'
                  : 'Gallery Photos (2-4 Optional)'}
              </label>

              {isEdit && existingImages.length > 0 && images.length === 0 && (
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                  <span className="text-[11px] font-mono text-zinc-400 block">
                    Current gallery photos ({existingImages.length}):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-14 h-14 object-cover rounded-lg border border-white/10"
                      />
                    ))}
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files))}
                className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4 bg-white text-black hover:bg-zinc-200 font-bold"
              isLoading={submitting}
              leftIcon={isEdit ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            >
              {isEdit ? 'Save Session Changes' : 'Publish Session Record'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionForm;
