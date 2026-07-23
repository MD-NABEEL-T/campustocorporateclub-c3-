import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    collegeEmail: { type: String, required: true, trim: true, lowercase: true },
    personalEmail: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 5 },
    registerNumber: { type: String, trim: true },
    preferredDomain: { type: String, required: true, trim: true },
    secondaryDomain: { type: String, trim: true },
    skills: { type: String, required: true, trim: true },
    experience: { type: String, trim: true },
    whyJoin: { type: String, required: true, trim: true },
    portfolioUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Applications are independent of the User collection - selection and
// account creation for accepted applicants is a manual, separate admin step.
export default mongoose.model('Application', applicationSchema);