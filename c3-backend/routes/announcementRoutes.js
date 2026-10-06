import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getAnnouncements,
  updateTodaySession,
  createBroadcast,
  deleteAnnouncement,
} from '../controllers/announcementController.js';

const router = express.Router();

// GET /api/announcements (Accessible by all logged-in C3 members)
router.get('/', protect, getAnnouncements);

// ADMIN ONLY - update today's upcoming session details
router.post('/today-session', protect, adminOnly, updateTodaySession);

// ADMIN ONLY - post a general broadcast
router.post('/broadcast', protect, adminOnly, createBroadcast);

// ADMIN ONLY - delete announcement
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

export default router;
