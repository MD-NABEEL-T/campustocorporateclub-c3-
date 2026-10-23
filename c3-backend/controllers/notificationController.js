import PushSubscription from '../models/PushSubscription.js';
import { broadcastPushNotification } from '../utils/pushNotificationService.js';

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
    res.json({ message: 'Unsubscribed from notifications' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to unsubscribe' });
  }
};

// Sends a test notification to verify delivery (Admin/Staff only)
export const sendTestNotification = async (req, res) => {
  try {
    const result = await broadcastPushNotification(
      {
        title: '🔔 C3 Club Test Notification',
        body: 'If you see this, push notifications are working perfectly on your device!',
        data: { url: '/dashboard' },
      },
      [req.user._id.toString()]
    );

    res.json({ message: 'Test notification triggered', result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send test notification', error: err.message });
  }
};

// Endpoint to trigger or check the 12:55 PM reminder check (can be pinged by uptime monitors / cron services)
export const triggerReminders = async (req, res) => {
  try {
    const { checkAndSendSessionReminders } = await import('../services/reminderScheduler.js');
    const result = await checkAndSendSessionReminders();
    res.json({ message: 'Reminder check completed', result });
  } catch (err) {
    res.status(500).json({ message: 'Failed to trigger reminder check', error: err.message });
  }
};
