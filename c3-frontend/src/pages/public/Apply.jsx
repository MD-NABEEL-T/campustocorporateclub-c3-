import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  UploadCloud,
  CheckCircle2,
  Send,
  X,
  Sparkles,
  AlertCircle,
  Clock,
  Code2,
  Users
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const SECTION_OPTIONS = [
  { value: 'CSE A', label: 'CSE - Section A (2nd Year)' },
  { value: 'CSE B', label: 'CSE - Section B (2nd Year)' },
];

export const Apply = () => {
  const [fullName, setFullName] = useState('');
  const [section, setSection] = useState('CSE A');
  const [whyJoin, setWhyJoin] = useState('');
  const [idCardFile, setIdCardFile] = useState(null);
  const [idCardPreview, setIdCardPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const { addToast } = useToast();

  const handleIdCardChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, idCard: 'Please select a valid image file (JPG, PNG, or WEBP)' }));
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, idCard: 'ID card photo must be under 8MB' }));
        return;
      }
      setIdCardFile(file);
      setIdCardPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, idCard: undefined }));
    }
  };

  const removeIdCard = () => {
    setIdCardFile(null);
    setIdCardPreview('');
  };

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!section) errs.section = 'Please select your section';
    if (!whyJoin.trim()) errs.whyJoin = 'Please tell us why you want to join C3';
    else if (whyJoin.trim().length < 15) errs.whyJoin = 'Please provide a little more detail (at least 15 characters)';
    if (!idCardFile) errs.idCard = 'College ID Card photo is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please fill all required fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('section', section);
      formData.append('year', '2'); // Exclusively 2nd year
      formData.append('department', 'CSE');
      formData.append('whyJoin', whyJoin.trim());
      if (idCardFile) {
        formData.append('idCard', idCardFile);
      }

      await api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmitted(true);
      addToast('Application submitted successfully!', 'success');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit application. Please try again.';
      setServerError(message);
      addToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 sm:py-24 bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="text-center p-8 sm:p-12 bg-zinc-950 border border-white/10 space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Application Submitted!
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
                Thank you, <span className="text-white font-semibold">{fullName}</span>. Your application for <span className="text-white font-semibold">{section}</span> (2nd Year) has been submitted. C3 coordinators will review your details.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="primary" className="w-full sm:w-auto">
                  Return to Homepage
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-black text-white px-4 py-12 sm:py-16 lg:py-20">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header and Honest Overview */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium text-white bg-white/10 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Recruitment Open • 2nd Year CSE Only
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight text-white">
            Join Campus to Corporate Club
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mx-auto">
            C3 conducts <strong className="text-white">daily 30-minute peer sessions</strong>, hands-on <strong className="text-white">activities</strong>, and <strong className="text-white">events</strong> for the Computer Science & Engineering department.
          </p>

          {/* Quick Highlight Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-white shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Daily 30-Min</p>
                <p className="text-[11px] text-zinc-400">Peer presentation sessions</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-white shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Activities & Events</p>
                <p className="text-[11px] text-zinc-400">Collaborative technical tasks</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 text-white shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">2nd Year CSE</p>
                <p className="text-[11px] text-zinc-400">Section A & Section B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Submission Error</p>
              <p className="text-xs text-red-300 mt-0.5">{serverError}</p>
            </div>
          </div>
        )}

        {/* Main Application Form Card */}
        <Card className="bg-zinc-950/90 border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                Application Form
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Fill in the 4 required details below
              </p>
            </div>
            <Badge variant="default">2nd Year CSE</Badge>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <Input
                label="Full Name *"
                type="text"
                placeholder="e.g. Mohammed Rayan"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                error={errors.fullName}
                required
              />
            </div>

            {/* Section */}
            <div>
              <Select
                label="Section (2nd Year CSE) *"
                value={section}
                onChange={(e) => {
                  setSection(e.target.value);
                  if (errors.section) setErrors((prev) => ({ ...prev, section: undefined }));
                }}
                options={SECTION_OPTIONS}
                error={errors.section}
                required
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Recruitment is open only for 2nd Year CSE Section A and Section B.
              </p>
            </div>

            {/* Why Join */}
            <div>
              <Textarea
                label="Why do you want to join C3? *"
                placeholder="Share your interest in participating in daily 30-minute peer presentations, activities, and club events..."
                rows={4}
                value={whyJoin}
                onChange={(e) => {
                  setWhyJoin(e.target.value);
                  if (errors.whyJoin) setErrors((prev) => ({ ...prev, whyJoin: undefined }));
                }}
                error={errors.whyJoin}
                required
              />
            </div>

            {/* ID Card Photo Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                College ID Card Photo *
              </label>

              {!idCardPreview ? (
                <label className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl border-2 border-dashed ${errors.idCard ? 'border-red-500/50 bg-red-500/5' : 'border-white/20 bg-zinc-900/40 hover:border-white/40 hover:bg-zinc-900/80'} cursor-pointer transition-all`}>
                  <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                  <span className="text-sm font-medium text-zinc-200">
                    Click or drag & drop ID card photo
                  </span>
                  <span className="text-xs text-zinc-500 mt-1">
                    JPG, PNG, or WEBP up to 8MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIdCardChange}
                    className="sr-only"
                  />
                </label>
              ) : (
                <div className="relative rounded-xl border border-white/15 bg-zinc-900 p-3 flex items-center gap-4">
                  <img
                    src={idCardPreview}
                    alt="College ID Preview"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {idCardFile?.name || 'College ID Card'}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {(idCardFile?.size ? (idCardFile.size / 1024 / 1024).toFixed(2) : '0')} MB
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready to upload
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeIdCard}
                    className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errors.idCard && (
                <p className="text-xs text-red-400 mt-1">{errors.idCard}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center"
                isLoading={submitting}
                leftIcon={<Send className="w-4 h-4" />}
              >
                {submitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Apply;
