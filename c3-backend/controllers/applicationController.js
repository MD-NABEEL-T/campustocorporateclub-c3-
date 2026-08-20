import crypto from 'crypto';
import Application from '../models/Application.js';

const REQUIRED_FIELDS = [
  'fullName',
  'collegeEmail',
  'phone',
  'department',
  'year',
  'preferredDomain',
  'skills',
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

// PUBLIC - submit a recruitment application in one shot (no draft step).
// No account is created here; selection and User creation for accepted
// applicants is a manual admin step. Unchanged behavior from before drafts
// existed, aside from explicitly setting status to 'pending' now that the
// schema default changed to 'draft'.
export const createApplication = async (req, res) => {
  try {
    const body = req.body || {};

    const validationError = validateComplete(body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const collegeEmail = clean(body.collegeEmail).toLowerCase();

    // Only a non-draft application with this email counts as a real
    // duplicate - a stray abandoned draft shouldn't block a fresh
    // submission.
    const existing = await Application.findOne({ collegeEmail, status: { $ne: 'draft' } });
    if (existing) {
      return res.status(409).json({ message: 'An application with this college email already exists' });
    }

    const applicationData = { status: 'pending' };
    assignFields(applicationData, body);
    applicationData.collegeEmail = collegeEmail;
    if (req.file) applicationData.resumeUrl = req.file.path;

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

// PUBLIC - start a new draft application. Accepts an optional partial body
// (whatever the applicant has filled in on step 1) and returns the
// resumeToken the frontend must hold onto (in localStorage) to update,
// retrieve, or submit this draft later. No auth - the token itself is the
// only thing that grants access to this draft.
export const createDraft = async (req, res) => {
  try {
    const body = req.body || {};
    const validationError = validatePartial(body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const draftData = { status: 'draft', resumeToken: generateResumeToken() };
    assignFields(draftData, body);
    if (req.file) draftData.resumeUrl = req.file.path;

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

// PUBLIC - update an existing draft. Requires the resumeToken issued at
// creation; only matches documents still in 'draft' status, so a token can
// never be replayed to edit an application that has already been submitted.
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
    if (req.file) draft.resumeUrl = req.file.path;

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

// PUBLIC - resume a draft. Requires the resumeToken; only matches documents
// still in 'draft' status. Used on page load to repopulate the form.
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

// PUBLIC - finalize a draft into a real, complete application. Validates
// every required field is present and well-formed (same rule as the
// one-shot endpoint), enforces the college-email duplicate check, flips
// status to 'pending', and clears the resumeToken so it can no longer be
// used to view or edit the application afterwards.
export const submitDraft = async (req, res) => {
  try {
    const { resumeToken } = req.params;
    const body = req.body || {};

    const draft = await Application.findOne({ resumeToken, status: 'draft' });
    if (!draft) {
      return res.status(404).json({ message: 'Draft not found. It may have already been submitted or expired.' });
    }

    // Allow a final round of field edits to arrive with the submit call
    // itself (e.g. the review step lets someone fix a typo, or the resume
    // file is attached only at the very end).
    const partialError = validatePartial(body);
    if (partialError) {
      return res.status(400).json({ message: partialError });
    }
    assignFields(draft, body);
    if (req.file) draft.resumeUrl = req.file.path;

    const completeError = validateComplete(draft.toObject());
    if (completeError) {
      return res.status(400).json({ message: completeError });
    }

    const existing = await Application.findOne({
      collegeEmail: draft.collegeEmail,
      status: { $ne: 'draft' },
      _id: { $ne: draft._id },
    });
    if (existing) {
      return res.status(409).json({ message: 'An application with this college email already exists' });
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