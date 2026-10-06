import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  CheckCircle2,
  Send,
  FileText,
  X,
  ArrowLeft,
  ArrowRight,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DOMAIN_OPTIONS } from '../../constants/domains';
import { fadeInUp } from '../../utils/animations';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';

const SECTION_OPTIONS = [
  { value: 'CSE A', label: 'CSE - Section A' },
  { value: 'CSE B', label: 'CSE - Section B' },
  { value: 'Other', label: 'Other Section / Branch' },
];

const YEAR_OPTIONS = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
  { value: '5', label: '5th Year' },
];

const EMPTY_FORM = {
  fullName: '',
  collegeEmail: '',
  personalEmail: '',
  phone: '',
  department: 'Computer Science & Engineering',
  section: 'CSE A',
  year: '1',
  registerNumber: '',
  preferredDomain: '',
  secondaryDomain: '',
  skills: '',
  experience: '',
  whyJoin: '',
  portfolioUrl: '',
  githubUrl: '',
  linkedinUrl: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const URL_REGEX = /^https?:\/\/.+/i;
const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

const DRAFT_STORAGE_KEY = 'c3_apply_draft';

const loadStoredDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const storeDraft = (applicationId, resumeToken, step) => {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ applicationId, resumeToken, step }));
  } catch {
    // Storage can fail
  }
};

const clearStoredDraft = () => {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // no-op
  }
};

const STEPS = [
  { key: 'personal', label: 'Personal', fields: ['fullName', 'phone', 'collegeEmail', 'personalEmail'] },
  { key: 'academic', label: 'Academic', fields: ['department', 'section', 'year', 'registerNumber'] },
  { key: 'domain', label: 'Domain & Motivation', fields: ['preferredDomain', 'secondaryDomain', 'skills', 'whyJoin'] },
  { key: 'idcard', label: 'ID Card & Links', fields: ['portfolioUrl', 'githubUrl', 'linkedinUrl'] },
  { key: 'review', label: 'Review', fields: [] },
];

const validateField = (form, resumeFile, field) => {
  switch (field) {
    case 'fullName':
      return !form.fullName.trim() ? 'Full name is required' : undefined;
    case 'collegeEmail':
      if (!form.collegeEmail.trim()) return 'College email is required';
      if (!EMAIL_REGEX.test(form.collegeEmail.trim())) return 'Enter a valid email address';
      return undefined;
    case 'personalEmail':
      if (form.personalEmail.trim() && !EMAIL_REGEX.test(form.personalEmail.trim())) {
        return 'Enter a valid email address';
      }
      return undefined;
    case 'phone':
      if (!form.phone.trim()) return 'Phone number is required';
      if (!PHONE_REGEX.test(form.phone.trim())) return 'Enter a valid 10-digit phone number';
      return undefined;
    case 'department':
      return !form.department.trim() ? 'Department is required' : undefined;
    case 'section':
      return !form.section ? 'Select your section' : undefined;
    case 'year':
      return !form.year ? 'Select your current year' : undefined;
    case 'preferredDomain':
      return !form.preferredDomain ? 'Select a preferred domain' : undefined;
    case 'skills':
      return !form.skills.trim() ? 'List at least a few relevant skills or interests' : undefined;
    case 'whyJoin':
      return !form.whyJoin.trim() ? 'Tell us why you want to join C3' : undefined;
    case 'portfolioUrl':
    case 'githubUrl':
    case 'linkedinUrl':
      if (form[field].trim() && !URL_REGEX.test(form[field].trim())) return 'Must be a valid http(s) link';
      return undefined;
    default:
      return undefined;
  }
};

const validateStep = (form, resumeFile, stepIndex) => {
  const errors = {};
  STEPS[stepIndex].fields.forEach((field) => {
    const error = validateField(form, resumeFile, field);
    if (error) errors[field] = error;
  });
  if (stepIndex === 3 && resumeFile && resumeFile.size > MAX_RESUME_SIZE) {
    errors.resume = 'Resume must be under 5MB';
  }
  return errors;
};

const validateAll = (form, resumeFile) => {
  let errors = {};
  STEPS.forEach((_, i) => {
    errors = { ...errors, ...validateStep(form, resumeFile, i) };
  });
  return errors;
};

export const ApplicationForm = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [resumeFile, setResumeFile] = useState(null);
  const [idCardFile, setIdCardFile] = useState(null);
  const [idCardPreview, setIdCardPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [savingDraft, setSavingDraft] = useState(false);
  const [resuming, setResuming] = useState(true);
  const [resumeBannerVisible, setResumeBannerVisible] = useState(false);
  const { addToast } = useToast();

  const draftRef = useRef({ applicationId: null, resumeToken: null });

  useEffect(() => {
    const restoreDraft = async () => {
      const stored = loadStoredDraft();
      if (!stored?.resumeToken) {
        setResuming(false);
        return;
      }

      try {
        const res = await api.get(`/applications/draft/${stored.resumeToken}`);
        const application = res.data.application || {};
        const restoredForm = { ...EMPTY_FORM };
        Object.keys(EMPTY_FORM).forEach((key) => {
          if (application[key] !== undefined && application[key] !== null) {
            restoredForm[key] = String(application[key]);
          }
        });
        setForm(restoredForm);
        draftRef.current = { applicationId: application._id, resumeToken: stored.resumeToken };
        setStepIndex(Math.min(stored.step ?? 0, STEPS.length - 1));
        setResumeBannerVisible(true);
      } catch {
        clearStoredDraft();
      } finally {
        setResuming(false);
      }
    };

    restoreDraft();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
    if (errors.resume) setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const handleIdCardChange = (e) => {
    const file = e.target.files?.[0] || null;
    setIdCardFile(file);
    if (file) {
      setIdCardPreview(URL.createObjectURL(file));
    } else {
      setIdCardPreview('');
    }
  };

  const buildFormData = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim()) {
        formData.append(key, value.trim());
      } else if (value) {
        formData.append(key, value);
      }
    });
    if (idCardFile) formData.append('idCard', idCardFile);
    if (resumeFile) formData.append('resume', resumeFile);
    return formData;
  };

  const persistDraft = async ({ silent }) => {
    if (!silent) setSavingDraft(true);
    try {
      const formData = buildFormData();
      let response;
      if (draftRef.current.resumeToken) {
        response = await api.patch(`/applications/draft/${draftRef.current.resumeToken}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/applications/draft', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        draftRef.current = {
          applicationId: response.data.applicationId,
          resumeToken: response.data.resumeToken,
        };
      }
      storeDraft(draftRef.current.applicationId, draftRef.current.resumeToken, stepIndex);
      if (!silent) addToast('Draft saved successfully.', 'success');
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Could not save your progress right now.';
      if (!silent) addToast(message, 'error');
      return false;
    } finally {
      if (!silent) setSavingDraft(false);
    }
  };

  const goNext = async () => {
    const stepErrors = validateStep(form, resumeFile, stepIndex);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      addToast('Please fill all required fields', 'warning');
      return;
    }
    const nextIndex = Math.min(stepIndex + 1, STEPS.length - 1);
    setStepIndex(nextIndex);
    storeDraft(draftRef.current.applicationId, draftRef.current.resumeToken, nextIndex);
    persistDraft({ silent: true });
  };

  const goBack = () => {
    const prevIndex = Math.max(stepIndex - 1, 0);
    setStepIndex(prevIndex);
    storeDraft(draftRef.current.applicationId, draftRef.current.resumeToken, prevIndex);
  };

  const handleSaveAndContinueLater = () => {
    persistDraft({ silent: false });
  };

  const handleStartOver = () => {
    clearStoredDraft();
    draftRef.current = { applicationId: null, resumeToken: null };
    setForm(EMPTY_FORM);
    setResumeFile(null);
    setIdCardFile(null);
    setIdCardPreview('');
    setErrors({});
    setStepIndex(0);
    setResumeBannerVisible(false);
    addToast('Started a fresh application', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validateAll(form, resumeFile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstInvalidStep = STEPS.findIndex((step) =>
        step.fields.some((field) => validationErrors[field])
      );
      if (firstInvalidStep !== -1) setStepIndex(firstInvalidStep);
      addToast('Please fill all required fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = buildFormData();
      if (draftRef.current.resumeToken) {
        await api.post(`/applications/draft/${draftRef.current.resumeToken}/submit`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/applications', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      clearStoredDraft();
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

  if (resuming) {
    return (
      <Card className="max-w-3xl mx-auto text-center p-10 bg-zinc-950 border border-white/10">
        <div className="mx-auto w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </Card>
    );
  }

  if (submitted) {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <Card className="max-w-2xl mx-auto text-center p-8 sm:p-12 space-y-4 bg-zinc-950 border border-white/15 rounded-3xl">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold font-heading text-white">Application Submitted!</h3>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
            Thanks for applying to Campus to Corporate Club (C3). All club members and coordinators can now review your profile. You will be reached out to for the next round.
          </p>
          <div className="pt-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              Status: Pending Review
            </span>
          </div>
        </Card>
      </motion.div>
    );
  }

  const currentStep = STEPS[stepIndex];

  return (
    <Card className="max-w-3xl mx-auto text-left p-6 sm:p-10 bg-zinc-950/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
      <div className="mb-6 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold text-white bg-white/10 border border-white/15 mb-2">
          JUNIOR BATCH HIRING
        </div>
        <h3 className="text-2xl font-bold font-heading text-white">Apply to Join C3</h3>
        <p className="text-xs sm:text-sm text-zinc-400">
          Open to junior students. Fill in your details below. Fields marked with <span className="text-red-400">*</span> are required.
        </p>
      </div>

      {resumeBannerVisible && (
        <div className="mb-6 p-3 rounded-xl bg-white/[0.05] border border-white/15 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-zinc-300 font-medium">
            Resumed your saved application draft.
          </p>
          <button
            type="button"
            onClick={handleStartOver}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start over
          </button>
        </div>
      )}

      {/* Step progress bar */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full h-1.5 rounded-full transition-colors ${
                i <= stepIndex ? 'bg-white' : 'bg-white/10'
              }`}
            />
            <span
              className={`text-[10px] font-mono uppercase tracking-wide hidden sm:block ${
                i === stepIndex ? 'text-white font-bold' : 'text-zinc-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs font-mono text-zinc-400 mb-6 sm:hidden">
        Step {stepIndex + 1} of {STEPS.length}: {currentStep.label}
      </p>

      {serverError && (
        <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.key}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            {/* 1. PERSONAL */}
            {currentStep.key === 'personal' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  1. Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Mohammed Fazil"
                    value={form.fullName}
                    onChange={handleChange('fullName')}
                    error={errors.fullName}
                  />
                  <Input
                    label="Phone Number *"
                    type="tel"
                    placeholder="9876543210"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    error={errors.phone}
                  />
                  <Input
                    label="College Email *"
                    type="email"
                    placeholder="yourname@cahcet.edu.in"
                    value={form.collegeEmail}
                    onChange={handleChange('collegeEmail')}
                    error={errors.collegeEmail}
                  />
                  <Input
                    label="Personal Email (Optional)"
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={form.personalEmail}
                    onChange={handleChange('personalEmail')}
                    error={errors.personalEmail}
                  />
                </div>
              </div>
            )}

            {/* 2. ACADEMIC */}
            {currentStep.key === 'academic' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  2. Academic & Section Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Section *"
                    value={form.section}
                    onChange={handleChange('section')}
                    error={errors.section}
                    options={SECTION_OPTIONS}
                  />

                  <Select
                    label="Current Year *"
                    value={form.year}
                    onChange={handleChange('year')}
                    error={errors.year}
                    options={YEAR_OPTIONS}
                  />

                  <Input
                    label="Department *"
                    placeholder="Computer Science & Engineering"
                    value={form.department}
                    onChange={handleChange('department')}
                    error={errors.department}
                  />

                  <Input
                    label="Register / Roll Number"
                    placeholder="e.g. 510423104001"
                    value={form.registerNumber}
                    onChange={handleChange('registerNumber')}
                  />
                </div>
              </div>
            )}

            {/* 3. DOMAIN & MOTIVATION */}
            {currentStep.key === 'domain' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  3. Domain Track & Motivation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Preferred Domain *"
                    value={form.preferredDomain}
                    onChange={handleChange('preferredDomain')}
                    error={errors.preferredDomain}
                    options={[{ value: '', label: 'Select a primary domain' }, ...DOMAIN_OPTIONS]}
                  />
                  <Select
                    label="Secondary Domain (Optional)"
                    value={form.secondaryDomain}
                    onChange={handleChange('secondaryDomain')}
                    options={[{ value: '', label: 'None / Only Primary' }, ...DOMAIN_OPTIONS]}
                  />
                </div>

                <Textarea
                  label="Why do you want to join C3? *"
                  placeholder="Tell us why you want to become part of Campus to Corporate, what you hope to learn, and what motivates you..."
                  rows={4}
                  value={form.whyJoin}
                  onChange={handleChange('whyJoin')}
                  error={errors.whyJoin}
                />

                <Textarea
                  label="Skills & Interests *"
                  placeholder="e.g. Web Development, C/Java, Python, Graphic Design, Problem Solving..."
                  rows={2}
                  value={form.skills}
                  onChange={handleChange('skills')}
                  error={errors.skills}
                />
              </div>
            )}

            {/* 4. ID CARD & LINKS */}
            {currentStep.key === 'idcard' && (
              <div className="space-y-6">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  4. College ID Card & Profiles
                </h4>

                {/* ID Card Photo Upload */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    College ID Card Photo (Image)
                  </label>
                  {idCardPreview ? (
                    <div className="relative p-3 rounded-2xl bg-zinc-900 border border-white/15 flex items-center gap-4">
                      <img
                        src={idCardPreview}
                        alt="ID Card Preview"
                        className="w-24 h-16 object-cover rounded-xl border border-white/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{idCardFile?.name || 'ID Card Attached'}</div>
                        <div className="text-[11px] text-zinc-400">Ready for upload</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIdCardFile(null);
                          setIdCardPreview('');
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border border-dashed border-white/15 bg-zinc-900/60 text-center cursor-pointer hover:border-white/40 transition-colors">
                      <UploadCloud className="w-6 h-6 text-zinc-400" />
                      <span className="text-xs text-zinc-300 font-medium">
                        Click to upload College ID Card Photo (JPG, PNG, WEBP)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIdCardChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Optional Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <Input
                    label="GitHub Profile URL"
                    placeholder="https://github.com/..."
                    value={form.githubUrl}
                    onChange={handleChange('githubUrl')}
                    error={errors.githubUrl}
                  />
                  <Input
                    label="LinkedIn Profile URL"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedinUrl}
                    onChange={handleChange('linkedinUrl')}
                    error={errors.linkedinUrl}
                  />
                  <Input
                    label="Portfolio / Projects Link"
                    placeholder="https://..."
                    value={form.portfolioUrl}
                    onChange={handleChange('portfolioUrl')}
                    error={errors.portfolioUrl}
                  />
                </div>

                {/* Optional Resume Upload */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Resume / Document (Optional)
                  </label>
                  {resumeFile ? (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900 border border-white/10">
                      <span className="flex items-center gap-2 text-xs text-white truncate">
                        <FileText className="w-4 h-4 text-white shrink-0" />
                        <span className="truncate">{resumeFile.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-white/10 bg-zinc-900/40 text-xs text-zinc-400 cursor-pointer hover:border-white/20">
                      <FileText className="w-4 h-4 text-zinc-400" />
                      <span>Attach PDF or Word Resume (Optional)</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* 5. REVIEW */}
            {currentStep.key === 'review' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
                  5. Review Your Application
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    ['Full Name', form.fullName],
                    ['Phone', form.phone],
                    ['College Email', form.collegeEmail],
                    ['Section', form.section],
                    ['Year', form.year ? `Year ${form.year}` : '-'],
                    ['Register Number', form.registerNumber || '-'],
                    ['Preferred Domain', DOMAIN_OPTIONS.find((d) => d.value === form.preferredDomain)?.label || '-'],
                    ['Secondary Domain', DOMAIN_OPTIONS.find((d) => d.value === form.secondaryDomain)?.label || 'None'],
                    ['ID Card Photo', idCardFile ? 'Attached' : 'Not attached'],
                    ['Resume', resumeFile ? resumeFile.name : 'Not attached'],
                  ].map(([label, value]) => (
                    <div key={label} className="p-3 rounded-xl bg-zinc-900/70 border border-white/5">
                      <p className="text-[10px] font-mono uppercase tracking-wide text-zinc-400">{label}</p>
                      <p className="text-white font-medium truncate mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>

                {idCardPreview && (
                  <div className="p-3 rounded-xl bg-zinc-900/70 border border-white/5">
                    <p className="text-[10px] font-mono uppercase tracking-wide text-zinc-400 mb-2">ID Card Preview</p>
                    <img src={idCardPreview} alt="ID Card" className="w-32 h-20 object-cover rounded-lg border border-white/10" />
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-white/5 space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wide text-zinc-400">Why Join C3</p>
                  <p className="text-white text-xs leading-relaxed">{form.whyJoin}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div>
            {stepIndex > 0 && (
              <Button type="button" variant="ghost" size="md" onClick={goBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              isLoading={savingDraft}
              onClick={handleSaveAndContinueLater}
              leftIcon={!savingDraft && <Save className="w-4 h-4" />}
              className="text-xs"
            >
              Save Draft
            </Button>
            {stepIndex < STEPS.length - 1 ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={goNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-white text-black hover:bg-zinc-200 font-semibold"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={submitting}
                leftIcon={!submitting && <Send className="w-4 h-4" />}
                className="bg-white text-black hover:bg-zinc-200 font-semibold"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
};

export default ApplicationForm;