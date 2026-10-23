import cron from 'node-cron';
import Announcement from '../models/Announcement.js';
import { getKolkataDayBounds } from '../utils/dateUtils.js';
import { broadcastPushNotification } from '../utils/pushNotificationService.js';

/**
 * Checks if an active session is scheduled for today and sends the 12:55 PM reminder if not sent yet
 */
export const checkAndSendSessionReminders = async () => {
  try {
    const today = new Date();
    const { startOfDay, endOfDay } = getKolkataDayBounds(today);

    // Look for active scheduled today_session announcements for today's date
    const sessionAnnouncement = await Announcement.findOne({
      type: 'today_session',
      status: 'scheduled',
      isActive: true,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!sessionAnnouncement) {
      return { triggered: false, reason: 'No active session scheduled for today' };
    }

    // If reminder was already sent today, avoid duplicate notifications
    if (sessionAnnouncement.reminderSentAt) {
      const alreadySentBounds = getKolkataDayBounds(sessionAnnouncement.reminderSentAt);
      if (sessionAnnouncement.reminderSentAt >= alreadySentBounds.startOfDay) {
        return { triggered: false, reason: 'Reminder already sent today' };
      }
    }

    const topic = sessionAnnouncement.topic || 'Club Session';
    const venue = sessionAnnouncement.venue ? `at ${sessionAnnouncement.venue}` : '';
    const time = sessionAnnouncement.time || '1:00 PM';

    // Broadcast push notification to all approved members
    const result = await broadcastPushNotification({
      title: '🚨 C3 Session Starting Soon!',
      body: `Today's session "${topic}" starts in 5 minutes (${time}) ${venue}! Tap to open.`.trim(),
      data: { url: '/dashboard' },
    });

    sessionAnnouncement.reminderSentAt = new Date();
    await sessionAnnouncement.save();

    console.log(`[ReminderScheduler] 12:55 PM Session reminder sent. Delivered to ${result.sent} devices.`);
    return { triggered: true, sent: result.sent, failed: result.failed };
  } catch (err) {
    console.error('[ReminderScheduler] Error running session reminder:', err.message);
    return { triggered: false, error: err.message };
  }
};

/**
 * Initializes the node-cron scheduler for 12:55 PM IST daily
 */
export const initReminderScheduler = () => {
  try {
    // '55 12 * * *' = 12:55 PM every day in Asia/Kolkata (IST) timezone
    cron.schedule(
      '55 12 * * *',
      async () => {
        console.log('[ReminderScheduler] Running scheduled 12:55 PM session reminder check...');
        await checkAndSendSessionReminders();
      },
      {
        timezone: 'Asia/Kolkata',
      }
    );

    console.log('Automated 12:55 PM IST reminder scheduler initialized');
  } catch (err) {
    console.error('Failed to initialize reminder scheduler:', err.message);
  }
};
