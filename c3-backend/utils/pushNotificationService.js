import webPush from 'web-push';
import PushSubscription from '../models/PushSubscription.js';
import User from '../models/User.js';

let vapidConfigured = false;

export const initWebPush = () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const email = process.env.VAPID_EMAIL || 'mailto:tmdnabeel4656.tmn@gmail.com';

  if (publicKey && privateKey) {
    try {
      webPush.setVapidDetails(email, publicKey, privateKey);
      vapidConfigured = true;
      console.log('Web Push initialized with VAPID details');
    } catch (err) {
      console.error('Failed to initialize Web Push:', err.message);
    }
  } else {
    console.warn('Web Push VAPID keys not configured in environment variables');
  }
};

/**
 * Broadcasts a push notification to all approved members (or target user IDs)
 * @param {Object} payload - { title, body, icon, data: { url } }
 * @param {Array<string>|null} targetUserIds - optional array of User IDs to limit notification to
 */
export const broadcastPushNotification = async (payload, targetUserIds = null) => {
  if (!vapidConfigured) {
    initWebPush();
    if (!vapidConfigured) {
      console.warn('Cannot broadcast push: VAPID keys not configured');
      return { sent: 0, failed: 0 };
    }
  }

  try {
    let query = {};
    if (targetUserIds && Array.isArray(targetUserIds) && targetUserIds.length > 0) {
      query.user = { $in: targetUserIds };
    } else {
      // By default send to all approved users or admins
      const activeUsers = await User.find({
        $or: [{ isApproved: true }, { role: 'admin' }],
      }).select('_id');
      const activeUserIds = activeUsers.map((u) => u._id);
      query.user = { $in: activeUserIds };
    }

    const subscriptions = await PushSubscription.find(query);
    if (subscriptions.length === 0) {
      return { sent: 0, failed: 0 };
    }

    const stringifiedPayload = JSON.stringify({
      title: payload.title || 'C3 Club Update',
      body: payload.body || 'New update from Campus to Corporate Club',
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge || '/favicon.ico',
      data: payload.data || { url: '/' },
    });

    let sent = 0;
    let failed = 0;

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth,
              },
            },
            stringifiedPayload
          );
          sent += 1;
        } catch (err) {
          failed += 1;
          // Status 410 or 404 indicates the push subscription is expired or unsubscribed
          if (err.statusCode === 410 || err.statusCode === 404) {
            await PushSubscription.deleteOne({ _id: sub._id }).catch(() => {});
          } else {
            console.error('Push delivery error:', err.statusCode, err.message);
          }
        }
      })
    );

    return { sent, failed };
  } catch (err) {
    console.error('Error broadcasting push notification:', err.message);
    return { sent: 0, failed: 0, error: err.message };
  }
};
