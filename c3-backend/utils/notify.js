import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { broadcastPushNotification } from './pushNotificationService.js';

export const getNotificationsConfig = () => {
  const mode = (process.env.NOTIFICATIONS_MODE || 'test').trim().toLowerCase();
  const rawTestEmails = process.env.NOTIFY_TEST_EMAILS || '';
  const testEmails = rawTestEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return { mode, testEmails };
};

/**
 * Filter users according to NOTIFICATIONS_MODE and test emails
 */
const filterEligibleUsers = (users, { mode, testEmails }) => {
  if (mode === 'off') {
    return [];
  }
  if (mode === 'test') {
    return users.filter((u) => {
      const email = (u.email || '').trim().toLowerCase();
      return testEmails.includes(email);
    });
  }
  // 'live' mode - all approved users receive notifications
  return users;
};

/**
 * Sends notification (in-app and push) to specific user IDs
 *
 * @param {Array<string|ObjectId>} userIds - Target user IDs
 * @param {Object} payload - { type, title, body, link, refId, tag }
 * @param {Object} options - { excludeUserId, collapseWindowMs }
 */
export const notifyUsers = async (userIds, payload, options = {}) => {
  try {
    const config = getNotificationsConfig();
    if (config.mode === 'off') {
      return { inAppCount: 0, pushSent: 0, mode: 'off' };
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return { inAppCount: 0, pushSent: 0 };
    }

    // Exclude the actor from their own notification
    let targetIds = userIds.map((id) => String(id?._id ?? id));
    if (options.excludeUserId) {
      const excludeStr = String(options.excludeUserId?._id ?? options.excludeUserId);
      targetIds = targetIds.filter((id) => id !== excludeStr);
    }

    if (targetIds.length === 0) {
      return { inAppCount: 0, pushSent: 0 };
    }

    // Retrieve users to test email whitelist
    const users = await User.find({ _id: { $in: targetIds } })
      .select('_id email')
      .lean();

    const eligibleUsers = filterEligibleUsers(users, config);
    if (eligibleUsers.length === 0) {
      return { inAppCount: 0, pushSent: 0, mode: config.mode, note: 'No eligible recipients under current mode' };
    }

    const eligibleUserIds = eligibleUsers.map((u) => u._id);

    // Check for collapse / rapid edit window (e.g. 2 minutes)
    if (options.collapseWindowMs && payload.refId && payload.type) {
      const cutoff = new Date(Date.now() - options.collapseWindowMs);
      const recentExisting = await Notification.findOne({
        refId: String(payload.refId),
        type: payload.type,
        createdAt: { $gte: cutoff },
      });

      if (recentExisting) {
        // Collapse rapid edit: update existing in-app notifications instead of creating duplicates
        await Notification.updateMany(
          {
            refId: String(payload.refId),
            type: payload.type,
            createdAt: { $gte: cutoff },
          },
          {
            $set: {
              title: payload.title,
              body: payload.body,
              link: payload.link || '/dashboard',
              readAt: null, // mark as fresh unread update
            },
          }
        );

        // Web push: collapse using tag (browser replaces existing banner)
        let pushResult = { sent: 0, failed: 0 };
        try {
          pushResult = await broadcastPushNotification(
            {
              title: payload.title,
              body: payload.body,
              data: { url: payload.link || '/dashboard' },
              tag: payload.tag || `session-${payload.refId}`,
            },
            eligibleUserIds.map(String)
          );
        } catch (pushErr) {
          console.warn('[Notify] Push collapsed broadcast warning:', pushErr.message);
        }

        return {
          inAppCount: eligibleUserIds.length,
          pushSent: pushResult.sent || 0,
          collapsed: true,
        };
      }
    }

    // Standard notification insertion
    const notificationDocs = eligibleUserIds.map((userId) => ({
      user: userId,
      type: payload.type || 'system',
      title: payload.title,
      body: payload.body,
      link: payload.link || '/dashboard',
      refId: payload.refId ? String(payload.refId) : '',
      tag: payload.tag || '',
      readAt: null,
      createdAt: new Date(),
    }));

    await Notification.insertMany(notificationDocs);

    // Dispatch Web Push in background (failures never block in-app items)
    let pushResult = { sent: 0, failed: 0 };
    try {
      pushResult = await broadcastPushNotification(
        {
          title: payload.title,
          body: payload.body,
          data: { url: payload.link || '/dashboard' },
          tag: payload.tag || (payload.refId ? `session-${payload.refId}` : undefined),
        },
        eligibleUserIds.map(String)
      );
    } catch (pushErr) {
      console.warn('[Notify] Web push delivery error (in-app was saved):', pushErr.message);
    }

    return {
      inAppCount: notificationDocs.length,
      pushSent: pushResult.sent || 0,
      mode: config.mode,
    };
  } catch (err) {
    console.error('[Notify] Error in central notifyUsers:', err.message);
    return { inAppCount: 0, pushSent: 0, error: err.message };
  }
};

/**
 * Notifies all approved club members and admins
 */
export const notifyAllApproved = async (payload, options = {}) => {
  try {
    const activeUsers = await User.find({
      $or: [{ isApproved: true }, { role: 'admin' }],
    })
      .select('_id email')
      .lean();

    const userIds = activeUsers.map((u) => u._id);
    return await notifyUsers(userIds, payload, options);
  } catch (err) {
    console.error('[Notify] Error in notifyAllApproved:', err.message);
    return { inAppCount: 0, pushSent: 0, error: err.message };
  }
};

/**
 * Notifies all admins
 */
export const notifyAdmins = async (payload, options = {}) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('_id email').lean();
    const adminIds = admins.map((u) => u._id);
    return await notifyUsers(adminIds, payload, options);
  } catch (err) {
    console.error('[Notify] Error in notifyAdmins:', err.message);
    return { inAppCount: 0, pushSent: 0, error: err.message };
  }
};

export default {
  notifyUsers,
  notifyAllApproved,
  notifyAdmins,
  getNotificationsConfig,
};
