import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
} from '../controllers/eventController.js';

const router = express.Router();

const eventUpload = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'gallery', maxCount: 6 },
]);

// TEMP DIAGNOSTIC LOGGING - remove after debugging
router.post(
  '/',
  (req, res, next) => { console.log('[DIAG 1] POST /events request received'); next(); },
  protect,
  (req, res, next) => { console.log('[DIAG 2] auth passed, user role:', req.user?.role); next(); },
  adminOnly,
  (req, res, next) => { console.log('[DIAG 3] adminOnly passed, entering eventUpload'); next(); },
  eventUpload,
  (req, res, next) => {
    console.log('[DIAG 4] eventUpload middleware finished');
    console.log('[DIAG 4a] coverImage received:', !!req.files?.coverImage?.length);
    console.log('[DIAG 4b] gallery files received:', req.files?.gallery?.length || 0);
    next();
  },
  createEvent
);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', protect, adminOnly, eventUpload, updateEvent);

export default router;