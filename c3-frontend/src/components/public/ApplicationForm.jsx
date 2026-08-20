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
  department: '',
  year: '',
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

// A draft is only ever identified by this locally-stored resumeToken - it's
// never derived from the applicant's email, so nobody can pull up someone
// else's in-progress application by guessing an address or an ID.
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
    // Storage can fail (private browsing, quota) - the draft still exists
    // server-side, the applicant just won't get an automatic resume prompt
    // on this device next time.
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
  { key: 'academic', label: 'Academic', fields: ['department', 'year', 'registerNumber'] },
  { key: 'domain', label: 'Domain & Skills', fields: ['preferredDomain', 'secondaryDomain', 'skills', 'experience', 'whyJoin'] },
  { key: 'links', label: 'Links & Resume', fields: ['portfolioUrl', 'githubUrl', 'linkedinUrl'] },
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
    case 'year':
      return !form.year ? 'Select your current year' : undefined;
    case 'preferredDomain':
      return !form.preferredDomain ? 'Select a preferred domain' : undefined;
    case 'skills':
      return !form.skills.trim() ? 'List at least a few relevant skills' : undefined;
    case 'whyJoin':
      return !form.whyJoin.trim() ? 'Tell us why you want to join' : undefined;
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

  // On mount, check for a locally-stored draft and try to pull it from the
  // backend. If the token is gone/expired/already-submitted, silently start
  // fresh instead of showing an error - this is a nice-to-have resume, not
  // a hard requirement.
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
    if (errors.resume) setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const buildFormData = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value.trim()) formData.append(key, value.trim());
    });
    if (resumeFile) formData.append('resume', resumeFile);
    return formData;
  };

  // Creates the draft on the backend if one doesn't exist yet, otherwise
  // PATCHes the existing one. Returns true on success. `silent` controls
  // whether a toast/loading state is shown - background saves triggered by
  // "Next" stay quiet, the explicit "Save & Continue Later" button doesn't.
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
      if (!silent) addToast('Draft saved - you can close this tab and continue later.', 'success');
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
      addToast('Please fix the highlighted fields', 'warning');
      return;
    }
    const nextIndex = Math.min(stepIndex + 1, STEPS.length - 1);
    setStepIndex(nextIndex);
    storeDraft(draftRef.current.applicationId, draftRef.current.resumeToken, nextIndex);
    // Best-effort background save - don't block navigation on it.
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
      addToast('Please fix the highlighted fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (draftRef.current.resumeToken) {
        const formData = buildFormData();
        await api.post(`/applications/draft/${draftRef.current.resumeToken}/submit`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const formData = buildFormData();
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
      <Card className="max-w-3xl mx-auto text-center p-10">
        <div className="mx-auto w-8 h-8 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin" />
      </Card>
    );
  }

  if (submitted) {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <Card className="max-w-2xl mx-auto text-center p-10 space-y-4 border-[#22C55E]/30">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-[#22C55E]" />
          </div>
          <h3 className="text-2xl font-bold font-heading text-[#F8FAFC]">Application Submitted</h3>
          <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md mx-auto">
            Thanks for applying to Campus to Corporate. Our coordinators will review your application and
            reach out via your college email if you're shortlisted for the next round.
          </p>
          <Badge variant="success">Status: Pending Review</Badge>
        </Card>
      </motion.div>
    );
  }

  const currentStep = STEPS[stepIndex];

  return (
    <Card className="max-w-3xl mx-auto text-left p-6 sm:p-10">
      <div className="mb-6 space-y-1">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8]">
          Junior Batch Application
        </span>
        <h3 className="text-2xl font-bold font-heading text-[#F8FAFC]">Tell us about yourself</h3>
        <p className="text-sm text-[#94A3B8]">
          Fields marked with <span className="text-[#EF4444]">*</span> are required. This is an application
          only - accounts are created manually after selection.
        </p>
      </div>

      {resumeBannerVisible && (
        <div className="mb-6 p-3 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-[#38BDF8] font-medium">
            Continuing your saved application - pick up right where you left off.
          </p>
          <button
            type="button"
            onClick={handleStartOver}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Start over instead
          </button>
        </div>
      )}

      {/* Step progress */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`w-full h-1.5 rounded-full transition-colors ${
                i <= stepIndex ? 'bg-[#38BDF8]' : 'bg-white/10'
              }`}
            />
            <span
              className={`text-[10px] font-mono uppercase tracking-wide hidden sm:block ${
                i === stepIndex ? 'text-[#38BDF8] font-bold' : 'text-[#94A3B8]/60'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs font-mono text-[#94A3B8] mb-6 sm:hidden">
        Step {stepIndex + 1} of {STEPS.length}: {currentStep.label}
      </p>

      {serverError && (
        <div className="mb-6 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-medium text-[#EF4444]">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.key}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-8"
          >
            {currentStep.key === 'personal' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2DD4BF]">
                  Personal Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    placeholder="Jane Doe"
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
                    placeholder="you@college.edu"
                    value={form.collegeEmail}
                    onChange={handleChange('collegeEmail')}
                    error={errors.collegeEmail}
                  />
                  <Input
                    label="Personal Email"
                    type="email"
                    placeholder="you@gmail.com"
                    value={form.personalEmail}
                    onChange={handleChange('personalEmail')}
                    error={errors.personalEmail}
                  />
                </div>
              </div>
            )}

            {currentStep.key === 'academic' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2DD4BF]">
                  Academic Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Department *"
                    placeholder="Computer Science & Engineering"
                    value={form.department}
                    onChange={handleChange('department')}
                    error={errors.department}
                  />
                  <Select
                    label="Year *"
                    value={form.year}
                    onChange={handleChange('year')}
                    error={errors.year}
                    options={[{ value: '', label: 'Select year' }, ...YEAR_OPTIONS]}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Register Number"
                      placeholder="If applicable"
                      value={form.registerNumber}
                      onChange={handleChange('registerNumber')}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep.key === 'domain' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2DD4BF]">
                  Domain & Skills
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Preferred Domain *"
                    value={form.preferredDomain}
                    onChange={handleChange('preferredDomain')}
                    error={errors.preferredDomain}
                    options={[{ value: '', label: 'Select a domain' }, ...DOMAIN_OPTIONS]}
                  />
                  <Select
                    label="Secondary Domain"
                    value={form.secondaryDomain}
                    onChange={handleChange('secondaryDomain')}
                    options={[{ value: '', label: 'None' }, ...DOMAIN_OPTIONS]}
                  />
                </div>
                <Textarea
                  label="Skills *"
                  placeholder="e.g. React, Python, Figma, Public Speaking..."
                  rows={2}
                  value={form.skills}
                  onChange={handleChange('skills')}
                  error={errors.skills}
                />
                <Textarea
                  label="Experience"
                  placeholder="Any prior projects, internships, or club experience"
                  rows={3}
                  value={form.experience}
                  onChange={handleChange('experience')}
                />
                <Textarea
                  label="Why do you want to join C3? *"
                  placeholder="Tell us what draws you to Campus to Corporate"
                  rows={4}
                  value={form.whyJoin}
                  onChange={handleChange('whyJoin')}
                  error={errors.whyJoin}
                />
              </div>
            )}

            {currentStep.key === 'links' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2DD4BF]">
                  Links & Resume
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Portfolio URL"
                    placeholder="https://..."
                    value={form.portfolioUrl}
                    onChange={handleChange('portfolioUrl')}
                    error={errors.portfolioUrl}
                  />
                  <Input
                    label="GitHub URL"
                    placeholder="https://github.com/..."
                    value={form.githubUrl}
                    onChange={handleChange('githubUrl')}
                    error={errors.githubUrl}
                  />
                  <Input
                    label="LinkedIn URL"
                    placeholder="https://linkedin.com/in/..."
                    value={form.linkedinUrl}
                    onChange={handleChange('linkedinUrl')}
                    error={errors.linkedinUrl}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Resume Upload
                  </label>
                  {resumeFile ? (
                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#071A2B]/80 border border-white/10">
                      <span className="flex items-center gap-2 text-sm text-[#F8FAFC] truncate">
                        <FileText className="w-4 h-4 text-[#38BDF8] shrink-0" />
                        <span className="truncate">{resumeFile.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setResumeFile(null)}
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 shrink-0"
                        aria-label="Remove resume"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border border-dashed border-white/15 bg-[#071A2B]/60 text-center cursor-pointer hover:border-[#38BDF8]/40 transition-colors">
                      <UploadCloud className="w-6 h-6 text-[#94A3B8]" />
                      <span className="text-xs text-[#94A3B8]">
                        Click to upload PDF or Word doc <span className="text-[#94A3B8]/70">(max 5MB)</span>
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.resume && <p className="text-xs text-[#EF4444] mt-1">{errors.resume}</p>}
                </div>
              </div>
            )}

            {currentStep.key === 'review' && (
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2DD4BF]">
                  Review Your Application
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  {[
                    ['Full Name', form.fullName],
                    ['Phone', form.phone],
                    ['College Email', form.collegeEmail],
                    ['Personal Email', form.personalEmail || '-'],
                    ['Department', form.department],
                    ['Year', form.year ? YEAR_OPTIONS.find((y) => y.value === form.year)?.label : '-'],
                    ['Register Number', form.registerNumber || '-'],
                    ['Preferred Domain', DOMAIN_OPTIONS.find((d) => d.value === form.preferredDomain)?.label || '-'],
                    ['Secondary Domain', DOMAIN_OPTIONS.find((d) => d.value === form.secondaryDomain)?.label || '-'],
                    ['Resume', resumeFile ? resumeFile.name : 'Not attached'],
                  ].map(([label, value]) => (
                    <div key={label} className="p-3 rounded-lg bg-[#071A2B]/60 border border-white/5">
                      <p className="text-[10px] font-mono uppercase tracking-wide text-[#94A3B8]">{label}</p>
                      <p className="text-[#F8FAFC] font-medium truncate">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg bg-[#071A2B]/60 border border-white/5">
                  <p className="text-[10px] font-mono uppercase tracking-wide text-[#94A3B8]">Why Join C3</p>
                  <p className="text-[#F8FAFC] text-sm mt-1">{form.whyJoin}</p>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Go back to any step above to make changes before submitting.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
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
            >
              Save & Continue Later
            </Button>
            {stepIndex < STEPS.length - 1 ? (
              <Button type="button" variant="accent" size="md" onClick={goNext} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="accent"
                size="md"
                isLoading={submitting}
                leftIcon={!submitting && <Send className="w-4 h-4" />}
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