import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const MAX_IMAGES = 12;

const GalleryManager = () => {
  const { user } = useAuth();

  const [images, setImages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadImages = async () => {
    setLoadingList(true);
    try {
      const res = await api.get('/gallery');
      setImages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load gallery images');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileChange = e => {
    setFiles(Array.from(e.target.files).slice(0, MAX_IMAGES));
  };

  const handleUpload = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (files.length === 0) {
      setError('Choose at least one image');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));

      await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(`${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
      setFiles([]);
      await loadImages();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async id => {
    setError('');
    setDeletingId(id);
    try {
      await api.delete(`/gallery/${id}`);
      setImages(prev => prev.filter(img => img._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin">
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Admin Overview
        </Button>
      </Link>

      <Card className="max-w-2xl mx-auto bg-zinc-950/80 border border-white/10 p-6 sm:p-8">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold font-heading text-white">Homepage Gallery (Masonry)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            These images feed the "From past events" masonry grid on the homepage. They're
            separate from individual events - upload up to {MAX_IMAGES} at a time.
          </p>

          {error && (
            <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Images (up to {MAX_IMAGES})
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full text-xs text-zinc-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/10 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
              />
              {files.length > 0 && (
                <p className="text-[11px] text-zinc-400">{files.length} file(s) selected</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={submitting}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Upload to Gallery
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl mx-auto bg-zinc-950/80 border border-white/10 p-6 sm:p-8">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base sm:text-lg text-white">Current Images ({images.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loadingList && <p className="text-xs text-[#94A3B8]">Loading...</p>}

          {!loadingList && images.length === 0 && (
            <p className="text-xs text-[#94A3B8]">No gallery images yet - upload some above.</p>
          )}

          {!loadingList && images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map(img => (
                <div key={img._id} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video sm:aspect-square">
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDelete(img._id)}
                    disabled={deletingId === img._id}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                    title="Delete image"
                  >
                    {deletingId === img._id ? (
                      <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5 text-[#EF4444]" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryManager;