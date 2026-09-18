import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true },
    collegeEmail: { type: String, trim: true, lowercase: true },
    personalEmail: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    year: { type: Number, min: 1, max: 5 },
    registerNumber: { type: String, trim: true },
    preferredDomain: { type: String, trim: true },
    secondaryDomain: { type: String, trim: true },
    skills: { type: String, trim: true },
    experience: { type: String, trim: true },
    whyJoin: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    // Required fields are intentionally NOT enforced at the schema level
    // (Mongoose `required: true`) because a `draft` document is allowed to
    // hold partial data. Full-field validation for real submissions happens
    // in the controller (see REQUIRED_FIELDS in applicationController.js)
    // and runs both for the one-shot POST /applications flow and for
    // POST /applications/draft/:resumeToken/submit.
    status: {
      type: String,
      enum: ['draft', 'pending', 'shortlisted', 'accepted', 'rejected'],
      default: 'draft',
    },
    // Opaque random token handed to the applicant's browser so they can
    // save/resume a draft without authentication. Only ever set while the
    // application is a draft - cleared once submitted so the token can't be
    // reused to view or edit a finalized application. `sparse: true` lets
    // every non-draft document have no resumeToken without violating the
    // unique index.
    resumeToken: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

// Applications are independent of the User collection - selection and
// account creation for accepted applicants is a manual, separate admin step.
export default mongoose.model('Application', applicationSchema);