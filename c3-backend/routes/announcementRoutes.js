import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getAnnouncements,
  updateTodaySession,
  createBroadcast,
  deleteAnnouncement,
  quickEditAnnouncement,
  cancelAnnouncement,
  restoreAnnouncement,
} from '../controllers/announcementController.js';

const router = express.Router();

// GET /api/announcements (Accessible by all logged-in C3 members)
router.get('/', protect, getAnnouncements);

// ADMIN ONLY - update today's upcoming session details
router.post('/today-session', protect, adminOnly, updateTodaySession);

// ADMIN ONLY - quick edit venue, time, or message
router.patch('/:id/quick-edit', protect, adminOnly, quickEditAnnouncement);

// ADMIN ONLY - cancel a session announcement
router.patch('/:id/cancel', protect, adminOnly, cancelAnnouncement);

// ADMIN ONLY - restore a cancelled session announcement
router.patch('/:id/restore', protect, adminOnly, restoreAnnouncement);

// ADMIN ONLY - post a general broadcast
router.post('/broadcast', protect, adminOnly, createBroadcast);

// ADMIN ONLY - delete announcement
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

export default router;
