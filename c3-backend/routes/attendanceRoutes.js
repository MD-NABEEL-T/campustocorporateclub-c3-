import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getMyAttendance,
  getMemberAttendance,
  getAllAttendance,
} from '../controllers/attendanceController.js';

const router = express.Router();

// Current member's own attendance (must come before /:memberId)
router.get('/me', protect, getMyAttendance);

// Admin-only global attendance list (registered before any param route)
router.get('/all', protect, adminOnly, getAllAttendance);

// Specific member attendance (allowed only for admins or the member themselves)
router.get('/:memberId', protect, getMemberAttendance);

export default router;