import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { getPendingUsers, getApprovedUsers, approveUser, rejectUser } from '../controllers/userController.js';

const router = express.Router();

router.get('/pending', protect, adminOnly, getPendingUsers);
router.get('/approved', protect, adminOnly, getApprovedUsers);
router.put('/:id/approve', protect, adminOnly, approveUser);
router.delete('/:id', protect, adminOnly, rejectUser);

export default router;