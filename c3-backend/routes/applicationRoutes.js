import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import resumeUpload from '../middleware/resumeUpload.js';
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} from '../controllers/applicationController.js';

const router = express.Router();

// Wrap multer so upload errors (bad file type, size limit) return clean JSON
// instead of crashing past this route with an unhandled error.
const handleResumeUpload = (req, res, next) => {
  resumeUpload.single('resume')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Resume upload failed' });
    next();
  });
};

// PUBLIC - submit a recruitment application. No auth, no account creation.
router.post('/', handleResumeUpload, createApplication);

// ADMIN ONLY - prepared for the future admin review dashboard.
router.get('/', protect, adminOnly, getApplications);
router.get('/:id', protect, adminOnly, getApplicationById);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

export default router;