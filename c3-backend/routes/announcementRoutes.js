import express from 'express';
import { protect, staffOnly } from '../middleware/authMiddleware.js';
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

// Staff - update today's upcoming session details
router.post('/today-session', protect, staffOnly, updateTodaySession);

// Staff - quick edit venue, time, or message
router.patch('/:id/quick-edit', protect, staffOnly, quickEditAnnouncement);

// Staff - cancel a session announcement
router.patch('/:id/cancel', protect, staffOnly, cancelAnnouncement);

// Staff - restore a cancelled session announcement
router.patch('/:id/restore', protect, staffOnly, restoreAnnouncement);

// Staff - post a general broadcast
router.post('/broadcast', protect, staffOnly, createBroadcast);

// Staff - delete announcement (admin or creator)
router.delete('/:id', protect, staffOnly, deleteAnnouncement);

export default router;
