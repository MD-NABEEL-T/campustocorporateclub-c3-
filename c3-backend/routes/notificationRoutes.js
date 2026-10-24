import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  getVapidPublicKey,
  subscribeUser,
  unsubscribeUser,
  sendTestNotification,
  triggerReminders,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/notificationController.js';
import { protect, staffOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // Proceed without user if token expired; will check x-cron-secret
    }
  }
  next();
};

// Notification In-App API
router.get('/', protect, getUserNotifications);
router.patch('/read-all', protect, markAllNotificationsRead);
router.patch('/:id/read', protect, markNotificationRead);

// Web Push Subscriptions
router.get('/vapid-key', getVapidPublicKey);
router.post('/subscribe', protect, subscribeUser);
router.post('/unsubscribe', protect, unsubscribeUser);
router.post('/test', protect, staffOnly, sendTestNotification);

// Outside Trigger (requires x-cron-secret equal to CRON_SECRET or admin token)
router.get('/check-reminders', optionalAuth, triggerReminders);
router.post('/check-reminders', optionalAuth, triggerReminders);
router.get('/trigger-reminders', optionalAuth, triggerReminders);
router.post('/trigger-reminders', optionalAuth, triggerReminders);

export default router;
