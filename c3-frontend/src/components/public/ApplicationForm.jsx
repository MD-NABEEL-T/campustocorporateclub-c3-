import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, Send, FileText, X } from 'lucide-react';
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

const validate = (form, resumeFile) => {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = 'Full name is required';
  if (!form.collegeEmail.trim()) errors.collegeEmail = 'College email is required';
  else if (!EMAIL_REGEX.test(form.collegeEmail.trim())) errors.collegeEmail = 'Enter a valid email address';

  if (form.personalEmail.trim() && !EMAIL_REGEX.test(form.personalEmail.trim())) {
    errors.personalEmail = 'Enter a valid email address';
  }

  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (!PHONE_REGEX.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number';

  if (!form.department.trim()) errors.department = 'Department is required';
  if (!form.year) errors.year = 'Select your current year';
  if (!form.preferredDomain) errors.preferredDomain = 'Select a preferred domain';
  if (!form.skills.trim()) errors.skills = 'List at least a few relevant skills';
  if (!form.whyJoin.trim()) errors.whyJoin = 'Tell us why you want to join';

  ['portfolioUrl', 'githubUrl', 'linkedinUrl'].forEach((field) => {
    if (form[field].trim() && !URL_REGEX.test(form[field].trim())) {
      errors[field] = 'Must be a valid http(s) link';
    }
  });

  if (resumeFile && resumeFile.size > MAX_RESUME_SIZE) {
    errors.resume = 'Resume must be under 5MB';
  }

  return errors;
};

export const ApplicationForm = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const { addToast } = useToast();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setResumeFile(file);
    if (errors.resume) setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate(form, resumeFile);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addToast('Please fix the highlighted fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value.trim()) formData.append(key, value.trim());
      });
      if (resumeFile) formData.append('resume', resumeFile);

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

  return (
    <Card className="max-w-3xl mx-auto text-left p-6 sm:p-10">
      <div className="mb-8 space-y-1">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8]">
          Junior Batch Application
        </span>
        <h3 className="text-2xl font-bold font-heading text-[#F8FAFC]">Tell us about yourself</h3>
        <p className="text-sm text-[#94A3B8]">
          Fields marked with <span className="text-[#EF4444]">*</span> are required. This is an application
          only - accounts are created manually after selection.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-medium text-[#EF4444]">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Personal Details */}
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

        {/* Academic Details */}
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

        {/* Domain & Skills */}
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

        {/* Links & Resume */}
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

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full"
          isLoading={submitting}
          leftIcon={!submitting && <Send className="w-4 h-4" />}
        >
          {submitting ? 'Submitting Application...' : 'Submit Application'}
        </Button>
      </form>
    </Card>
  );
};

export default ApplicationForm;