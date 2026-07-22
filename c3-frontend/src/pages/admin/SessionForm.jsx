import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Upload, Plus } from 'lucide-react';

const SessionForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('technical');
  const [handledBy, setHandledBy] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!coverImage) {
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
      formData.append('coverImage', coverImage);
      images.forEach((img) => formData.append('images', img));

      const res = await api.post('/api/sessions', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/sessions/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/sessions">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Sessions List
        </Button>
      </Link>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Log New Daily Session</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 mb-4 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-medium text-[#EF4444]">
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

            <Select
              label="Session Track Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'technical', label: 'Technical Track' },
                { value: 'non-technical', label: 'Non-Technical Track' },
              ]}
            />

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
              placeholder="Provide a detailed summary of key concepts covered during the 15-minute presentation..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Cover Image (Required)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full text-xs text-[#94A3B8] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#38BDF8]/10 file:text-[#38BDF8] hover:file:bg-[#38BDF8]/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Gallery Photos (2-4 Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImages(Array.from(e.target.files))}
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
              Publish Session Record
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionForm;
