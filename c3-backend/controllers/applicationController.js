import crypto from 'crypto';
import Application from '../models/Application.js';

const REQUIRED_FIELDS = [
  'fullName',
  'section',
  'whyJoin',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/; // 10-digit Indian mobile number
const URL_REGEX = /^https?:\/\/.+/i;

const clean = (val) => (typeof val === 'string' ? val.trim() : val);

// Fields an applicant is ever allowed to set, whether on a draft or a full
// submission. Keeping this list in one place means the draft endpoints and
// the full-submit endpoint stay in sync automatically.
const ASSIGNABLE_FIELDS = [
  'fullName',
  'collegeEmail',
  'personalEmail',
  'phone',
  'department',
  'section',
  'year',
  'registerNumber',
  'preferredDomain',
  'secondaryDomain',
  'skills',
  'experience',
  'whyJoin',
  'portfolioUrl',
  'githubUrl',
  'linkedinUrl',
  'idCardUrl',
  'resumeUrl',
];

const URL_FIELDS = [
  ['portfolioUrl', 'Portfolio URL'],
  ['githubUrl', 'GitHub URL'],
  ['linkedinUrl', 'LinkedIn URL'],
];

// Validates only the fields that are actually present in `body`. Used for
// drafts, where partial/incomplete data is expected and fine - we just make
// sure whatever WAS provided is well-formed (a malformed email shouldn't be
// silently saved just because the applicant hasn't finished the form yet).
const validatePartial = (body) => {
  if (body.collegeEmail !== undefined && clean(body.collegeEmail)) {
    if (!EMAIL_REGEX.test(clean(body.collegeEmail).toLowerCase())) {
      return 'Enter a valid college email address';
    }
  }
  if (body.personalEmail !== undefined && clean(body.personalEmail)) {
    if (!EMAIL_REGEX.test(clean(body.personalEmail).toLowerCase())) {
      return 'Enter a valid personal email address';
    }
  }
  if (body.phone !== undefined && clean(body.phone)) {
    if (!PHONE_REGEX.test(clean(body.phone))) {
      return 'Enter a valid 10-digit phone number';
    }
  }
  if (body.year !== undefined && clean(body.year) !== '' && clean(body.year) !== undefined) {
    const year = Number(body.year);
    if (!Number.isInteger(year) || year < 1 || year > 5) {
      return 'Enter a valid academic year (1-5)';
    }
  }
  for (const [field, label] of URL_FIELDS) {
    const value = clean(body[field]);
    if (value && !URL_REGEX.test(value)) {
      return `${label} must be a valid http(s) link`;
    }
  }
  return null;
};

// Validates that a document (draft or otherwise) has everything a real
// submission needs. Shared by the one-shot full-submit endpoint and by
// POST /applications/draft/:resumeToken/submit so the "what counts as a
// complete application" rule only lives in one place.
const validateComplete = (data) => {
  const missing = REQUIRED_FIELDS.filter((field) => {
    const value = clean(data[field]);
    return value === undefined || value === null || value === '';
  });
  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }
  const partialError = validatePartial(data);
  if (partialError) return partialError;
  return null;
};

// Copies only the allowed, present fields from `body` onto `target`
// (a Mongoose document or a plain object), trimming/lowercasing as needed.
// Fields not present in `body` are left untouched - this is what makes
// draft updates genuinely partial instead of clobbering previously saved
// values with blanks.
const assignFields = (target, body) => {
  for (const field of ASSIGNABLE_FIELDS) {
    if (body[field] === undefined) continue;
    let value = clean(body[field]);
    if (field === 'year') {
      value = value === '' ? undefined : Number(value);
    }
    if ((field === 'collegeEmail' || field === 'personalEmail') && value) {
      value = value.toLowerCase();
    }
    // Treat an explicit empty string as "clear this optional field" for
    // everything except the ones caught above.
    target[field] = value === '' ? undefined : value;
  }
};

const generateResumeToken = () => crypto.randomBytes(24).toString('hex');

// Strips fields the client never needs back (the resume token itself,
// Mongo/version internals) from a draft response.
const serializeDraft = (application) => {
  const obj = application.toObject();
  delete obj.resumeToken;
  return obj;
};

const extractUploadedFiles = (req, target) => {
  if (req.files) {
    if (req.files.idCard && req.files.idCard[0]) {
      target.idCardUrl = req.files.idCard[0].path;
    }
    if (req.files.resume && req.files.resume[0]) {
      target.resumeUrl = req.files.resume[0].path;
    }
  }
  if (req.file) {
    if (req.file.fieldname === 'idCard') {
      target.idCardUrl = req.file.path;
    } else {
      target.resumeUrl = req.file.path;
    }
  }
};

// PUBLIC - submit a recruitment application in one shot (no draft step).
export const createApplication = async (req, res) => {
  try {
    const body = req.body || {};

    const validationError = validateComplete(body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const applicationData = { status: 'pending' };
    assignFields(applicationData, body);

    if (body.collegeEmail && clean(body.collegeEmail)) {
      const collegeEmail = clean(body.collegeEmail).toLowerCase();
      const existing = await Application.findOne({ collegeEmail, status: { $ne: 'draft' } });
      if (existing) {
        return res.status(409).json({ message: 'An application with this college email already exists' });
      }
      applicationData.collegeEmail = collegeEmail;
    }

    extractUploadedFiles(req, applicationData);

    const application = await Application.create(applicationData);

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: application._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An application with this college email already exists' });
    }
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0]?.message || 'Invalid application data';
      return res.status(400).json({ message: firstError });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUBLIC - start a new draft application.
export const createDraft = async (req, res) => {
  try {
    const body = req.body || {};
    const validationError = validatePartial(body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const draftData = { status: 'draft', resumeToken: generateResumeToken() };
    assignFields(draftData, body);
    extractUploadedFiles(req, draftData);

    const draft = await Application.create(draftData);

    res.status(201).json({
      applicationId: draft._id,
      resumeToken: draft.resumeToken,
      application: serializeDraft(draft),
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0]?.message || 'Invalid draft data';
      return res.status(400).json({ message: firstError });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUBLIC - update an existing draft.
export const updateDraft = async (req, res) => {
  try {
    const { resumeToken } = req.params;
    const body = req.body || {};

    const draft = await Application.findOne({ resumeToken, status: 'draft' });
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found. It may have already been submitted or expired.' });
    }

    const validationError = validatePartial(body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    assignFields(draft, body);
    extractUploadedFiles(req, draft);

    await draft.save();

    res.json({ message: 'Draft saved', application: serializeDraft(draft) });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0]?.message || 'Invalid draft data';
      return res.status(400).json({ message: firstError });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUBLIC - resume a draft.
export const getDraft = async (req, res) => {
  try {
    const { resumeToken } = req.params;
    const draft = await Application.findOne({ resumeToken, status: 'draft' });
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found. It may have already been submitted or expired.' });
    }
    res.json({ application: serializeDraft(draft) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUBLIC - finalize a draft into a real, complete application.
export const submitDraft = async (req, res) => {
  try {
    const { resumeToken } = req.params;
    const body = req.body || {};

    const draft = await Application.findOne({ resumeToken, status: 'draft' });
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found. It may have already been submitted or expired.' });
    }

    const partialError = validatePartial(body);
    if (partialError) {
      return res.status(400).json({ message: partialError });
    }
    assignFields(draft, body);
    extractUploadedFiles(req, draft);

    const completeError = validateComplete(draft.toObject());
    if (completeError) {
      return res.status(400).json({ message: completeError });
    }

    if (draft.collegeEmail) {
      const existing = await Application.findOne({
        collegeEmail: draft.collegeEmail,
        status: { $ne: 'draft' },
        _id: { $ne: draft._id },
      });
      if (existing) {
        return res.status(409).json({ message: 'An application with this college email already exists' });
      }
    }

    draft.status = 'pending';
    draft.resumeToken = undefined;
    await draft.save();

    res.json({
      message: 'Application submitted successfully',
      applicationId: draft._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An application with this college email already exists' });
    }
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0]?.message || 'Invalid application data';
      return res.status(400).json({ message: firstError });
    }
    res.status(500).json({ message: err.message });
  }
};

// ADMIN ONLY - list applications (drafts included) for the admin review
// dashboard. ?status= filters by draft/pending/shortlisted/accepted/rejected.
export const getApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await Application.find(filter).select('-resumeToken').sort({ updatedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN ONLY - single application detail for the admin review dashboard.
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).select('-resumeToken');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN ONLY - update application status (pending/shortlisted/accepted/rejected).
// Deliberately does NOT create a User account - account creation stays a
// separate, manual step for admins after reviewing an accepted application.
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'shortlisted', 'accepted', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.status === 'draft') {
      return res.status(409).json({ message: 'Cannot change the status of an unsubmitted draft' });
    }

    application.status = status;
    await application.save();

    const result = application.toObject();
    delete result.resumeToken;
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};