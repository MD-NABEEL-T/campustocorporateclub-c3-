import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

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

      const res = await api.post('/sessions', formData, {
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">New Session</h1>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
          >
            <option value="technical">Technical</option>
            <option value="non-technical">Non-technical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Handled By</label>
          <input
            type="text"
            value={handledBy}
            onChange={(e) => setHandledBy(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="w-full p-3 rounded bg-gray-800 text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Cover Image (required)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="w-full text-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Gallery Images (2-4, optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
            className="w-full text-gray-300"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Create Session'}
        </button>
      </form>
    </div>
  );
};

export default SessionForm;