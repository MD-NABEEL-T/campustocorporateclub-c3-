import express from 'express';
import {
  getVapidPublicKey,
  subscribeUser,
  unsubscribeUser,
  sendTestNotification,
  triggerReminders,
} from '../controllers/notificationController.js';
import { protect, staffOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/vapid-key', getVapidPublicKey);
router.post('/subscribe', protect, subscribeUser);
router.post('/unsubscribe', protect, unsubscribeUser);
router.post('/test', protect, staffOnly, sendTestNotification);
router.get('/check-reminders', triggerReminders); // Public/pinger accessible for 12:55 PM cron

export default router;
