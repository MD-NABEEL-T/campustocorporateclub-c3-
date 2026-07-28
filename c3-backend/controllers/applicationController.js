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

// PUBLIC - submit a recruitment application. No account is created here;
// selection and User creation for accepted applicants is a manual admin step.
export const createApplication = async (req, res) => {
  try {
    const body = req.body || {};

    const missing = REQUIRED_FIELDS.filter((field) => {
      const value = clean(body[field]);
      return value === undefined || value === null || value === '';
    });
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}` });
    }

    const collegeEmail = clean(body.collegeEmail).toLowerCase();
    if (!EMAIL_REGEX.test(collegeEmail)) {
      return res.status(400).json({ message: 'Enter a valid college email address' });
    }

    const personalEmail = clean(body.personalEmail);
    if (personalEmail && !EMAIL_REGEX.test(personalEmail.toLowerCase())) {
      return res.status(400).json({ message: 'Enter a valid personal email address' });
    }

    const phone = clean(body.phone);
    if (!PHONE_REGEX.test(phone)) {
      return res.status(400).json({ message: 'Enter a valid 10-digit phone number' });
    }

    const year = Number(body.year);
    if (!Number.isInteger(year) || year < 1 || year > 5) {
      return res.status(400).json({ message: 'Enter a valid academic year (1-5)' });
    }

    for (const [field, label] of [
      ['portfolioUrl', 'Portfolio URL'],
      ['githubUrl', 'GitHub URL'],
      ['linkedinUrl', 'LinkedIn URL'],
    ]) {
      const value = clean(body[field]);
      if (value && !URL_REGEX.test(value)) {
        return res.status(400).json({ message: `${label} must be a valid http(s) link` });
      }
    }

    const existing = await Application.findOne({ collegeEmail });
    if (existing) {
      return res.status(409).json({ message: 'An application with this college email already exists' });
    }

    const applicationData = {
      fullName: clean(body.fullName),
      collegeEmail,
      phone,
      department: clean(body.department),
      year,
      preferredDomain: clean(body.preferredDomain),
      skills: clean(body.skills),
      whyJoin: clean(body.whyJoin),
    };

    if (personalEmail) applicationData.personalEmail = personalEmail.toLowerCase();
    if (clean(body.registerNumber)) applicationData.registerNumber = clean(body.registerNumber);
    if (clean(body.secondaryDomain)) applicationData.secondaryDomain = clean(body.secondaryDomain);
    if (clean(body.experience)) applicationData.experience = clean(body.experience);
    if (clean(body.portfolioUrl)) applicationData.portfolioUrl = clean(body.portfolioUrl);
    if (clean(body.githubUrl)) applicationData.githubUrl = clean(body.githubUrl);
    if (clean(body.linkedinUrl)) applicationData.linkedinUrl = clean(body.linkedinUrl);
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

// ADMIN ONLY - prepared for the future admin review dashboard (not built yet).
export const getApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await Application.find(filter).sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN ONLY - single application detail, prepared for future admin dashboard.
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
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

    application.status = status;
    await application.save();

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
