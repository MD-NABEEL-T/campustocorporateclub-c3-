import express from 'express';
import { protect, adminOnly, staffOnly, ownerOnly } from '../middleware/authMiddleware.js';
import {
  getPendingUsers,
  getApprovedUsers,
  getAttendees,
  approveUser,
  rejectUser,
  updateUserAdminStatus,
  updateUserRole,
  getAdminAuditLogs,
  updateAttendanceStartDate,
  bulkUpdateAttendanceStartDate,
  resetUserPassword,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/pending', protect, adminOnly, getPendingUsers);
router.get('/approved', protect, adminOnly, getApprovedUsers);
router.get('/attendees', protect, staffOnly, getAttendees);
router.get('/admin-audit', protect, ownerOnly, getAdminAuditLogs);
router.post('/attendance-start/bulk', protect, adminOnly, bulkUpdateAttendanceStartDate);
router.post('/:id/reset-password', protect, adminOnly, resetUserPassword);
router.put('/:id/attendance-start', protect, staffOnly, updateAttendanceStartDate);
router.put('/:id/admin', protect, ownerOnly, updateUserAdminStatus);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.put('/:id/approve', protect, adminOnly, approveUser);
router.delete('/:id', protect, adminOnly, rejectUser);

export default router;