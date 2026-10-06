import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import resumeUpload from '../middleware/resumeUpload.js';
import {
  createApplication,
  createDraft,
  getDraft,
  updateDraft,
  submitDraft,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} from '../controllers/applicationController.js';

const router = express.Router();

// Wrap multer so upload errors return clean JSON.
const handleApplicationUpload = (req, res, next) => {
  resumeUpload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message || 'File upload failed',
      });
    }

    next();
  });
};

// PUBLIC - draft application flow.
// These must come before /:id.
router.post('/draft', handleApplicationUpload, createDraft);
router.get('/draft/:resumeToken', getDraft);
router.patch('/draft/:resumeToken', handleApplicationUpload, updateDraft);
router.post(
  '/draft/:resumeToken/submit',
  handleApplicationUpload,
  submitDraft
);

// PUBLIC - one-shot application submission.
router.post('/', handleApplicationUpload, createApplication);

// ALL C3 MEMBERS (Can view submitted junior applications)
router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);

// ADMIN ONLY (Can change application status)
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

export default router;