import PushSubscription from '../models/PushSubscription.js';
import Notification from '../models/Notification.js';
import { broadcastPushNotification } from '../utils/pushNotificationService.js';
import { notifyUsers } from '../utils/notify.js';
import { checkAndSendSessionReminders } from '../services/reminderScheduler.js';

// Returns the public VAPID key so frontend clients can subscribe
export const getVapidPublicKey = (req, res) => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return res.status(500).json({ message: 'VAPID public key not configured on server' });
  }
  res.json({ publicKey });
};

// Saves a browser/phone push subscription
export const subscribeUser = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: 'Invalid push subscription payload' });
    }

    const subscription = await PushSubscription.findOneAndUpdate(
      { endpoint },
      {
        user: req.user._id,
        endpoint,
        keys,
        userAgent: req.headers['user-agent'] || '',
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: 'Subscribed to notifications successfully',
      subscriptionId: subscription._id,
    });
  } catch (err) {
    console.error('Subscription error:', err.message);
    res.status(500).json({ message: 'Failed to save subscription' });
  }
};

// Removes a subscription when user toggles notifications off
export const unsubscribeUser = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (endpoint) {
      await PushSubscription.deleteOne({ endpoint, user: req.user._id });
    } else {
      // Remove all subscriptions for this user
      await PushSubscription.deleteMany({ user: req.user._id });
    }
    res.json({ message: 'Unsubscribed from notifications successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unsubscribe' });
  }
};

// Sends a test notification to verify delivery (Admin/Staff only)
export const sendTestNotification = async (req, res) => {
  try {
    const result = await notifyUsers(
      [req.user._id],
      {
        type: 'system',
        title: '🔔 C3 Club Test Notification',
        body: 'If you see this, notifications are working perfectly on your device!',
        link: '/dashboard',
        tag: 'test-notification',
      }
    );

    res.json({ message: 'Test notification triggered', result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send test notification', error: err.message });
  }
};

// Endpoint to trigger or check session reminder check (cron webhook or admin token)
export const triggerReminders = async (req, res) => {
  try {
    const cronSecretHeader = req.headers['x-cron-secret'];
    const configuredSecret = process.env.CRON_SECRET;

    const isAdmin = Boolean(req.user && req.user.role === 'admin');
    const secretMatches = Boolean(
      configuredSecret && cronSecretHeader && cronSecretHeader === configuredSecret
    );

    if (!configuredSecret) {
      console.warn('[WARNING] CRON_SECRET is unset. Rejecting external reminder trigger attempt.');
      if (!isAdmin) {
        return res.status(401).json({ message: 'CRON_SECRET is unset on server' });
      }
    } else if (!secretMatches && !isAdmin) {
      return res.status(401).json({ message: 'Unauthorized cron secret' });
    }

    const result = await checkAndSendSessionReminders();
    res.json({
      due: Boolean(result.due),
      sent: Boolean(result.sent),
      reason: result.reason || undefined,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to trigger reminder check', error: err.message });
  }
};

// GET /api/notifications?limit=30 (protect)
export const getUserNotifications = async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 30));

    const [items, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      Notification.countDocuments({ user: req.user._id, readAt: null }),
    ]);

    res.json({ items, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve notifications', error: err.message });
  }
};

// PATCH /api/notifications/:id/read (protect)
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { readAt: new Date() } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notification read', error: err.message });
  }
};

// PATCH /api/notifications/read-all (protect)
export const markAllNotificationsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, readAt: null },
      { $set: { readAt: new Date() } }
    );

    res.json({
      message: 'All notifications marked as read',
      count: result.modifiedCount || 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark all notifications read', error: err.message });
  }
};
