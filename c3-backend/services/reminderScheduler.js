import cron from 'node-cron';
import Announcement from '../models/Announcement.js';
import { getKolkataDayBounds, formatTimeDisplay } from '../utils/dateUtils.js';
import { notifyAllApproved } from '../utils/notify.js';

export const getReminderSettings = () => {
  const defaultStartTime = (process.env.SESSION_DEFAULT_START_TIME || '13:00').trim();
  const leadMinutes = parseInt(process.env.REMINDER_LEAD_MINUTES || '5', 10) || 5;
  return { defaultStartTime, leadMinutes };
};

/**
 * Computes the session start date, reminder time, and 15-minute cutoff time in Asia/Kolkata
 */
export const computeSessionReminderTimes = (date, startTime) => {
  const { defaultStartTime, leadMinutes } = getReminderSettings();
  const { dateStr } = getKolkataDayBounds(date || new Date());
  const effectiveStartTime =
    startTime && /^\d{1,2}:\d{2}$/.test(startTime.trim()) ? startTime.trim() : defaultStartTime;

  const [h, m] = effectiveStartTime.split(':').map((v) => parseInt(v, 10));
  const pad = (n) => String(n).padStart(2, '0');
  const sessionStartDate = new Date(`${dateStr}T${pad(h)}:${pad(m)}:00.000+05:30`);
  const reminderTime = new Date(sessionStartDate.getTime() - leadMinutes * 60 * 1000);
  const cutoffTime = new Date(sessionStartDate.getTime() + 15 * 60 * 1000);

  return { sessionStartDate, reminderTime, cutoffTime, effectiveStartTime };
};

/**
 * Checks if a session reminder is due for today and claims it atomically
 */
export const checkAndSendSessionReminders = async () => {
  try {
    const now = new Date();
    const { startOfDay, endOfDay } = getKolkataDayBounds(now);

    // Look for active today_session for today's IST date that is scheduled and active
    const sessionAnnouncement = await Announcement.findOne({
      type: 'today_session',
      status: 'scheduled',
      isActive: true,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!sessionAnnouncement) {
      return { due: false, sent: false, reason: 'No active session scheduled today' };
    }

    const { reminderTime, cutoffTime, effectiveStartTime } = computeSessionReminderTimes(
      sessionAnnouncement.date,
      sessionAnnouncement.startTime
    );

    const isDue = now >= reminderTime && now < cutoffTime;
    if (!isDue) {
      return { due: false, sent: false, reason: 'Reminder window is not currently active' };
    }

    // Atomically claim the send so external triggers and cron never double send
    const claimed = await Announcement.findOneAndUpdate(
      {
        _id: sessionAnnouncement._id,
        reminderSentAt: null,
      },
      {
        $set: { reminderSentAt: now },
      },
      { new: true }
    );

    if (!claimed) {
      return { due: true, sent: false, reason: 'Reminder already sent today' };
    }

    // Format 12-hour display time from effective start time
    const display12h = formatTimeDisplay(effectiveStartTime);
    const venueText = claimed.venue && claimed.venue.trim() ? ` at ${claimed.venue.trim()}` : '';

    await notifyAllApproved({
      type: 'reminder',
      title: `Session starts soon: ${claimed.topic}`,
      body: `Starts at ${display12h}${venueText}! Tap to open.`,
      link: '/dashboard',
      refId: String(claimed._id),
      tag: `session-reminder-${claimed._id}`,
    });

    console.log(
      `[ReminderScheduler] Session reminder sent for "${claimed.topic}" (Starts: ${display12h}${venueText})`
    );
    return { due: true, sent: true };
  } catch (err) {
    console.error('[ReminderScheduler] Error checking session reminders:', err.message);
    return { due: false, sent: false, error: err.message };
  }
};

/**
 * Initializes the node-cron scheduler to run every minute
 */
export const initReminderScheduler = () => {
  try {
    // Run every minute ('* * * * *')
    cron.schedule(
      '* * * * *',
      async () => {
        await checkAndSendSessionReminders();
      },
      {
        timezone: 'Asia/Kolkata',
      }
    );

    const { defaultStartTime, leadMinutes } = getReminderSettings();
    console.log(
      `Automated per-minute reminder scheduler initialized (Default Start: ${defaultStartTime}, Lead: ${leadMinutes}m)`
    );
  } catch (err) {
    console.error('Failed to initialize reminder scheduler:', err.message);
  }
};

export default {
  checkAndSendSessionReminders,
  initReminderScheduler,
  computeSessionReminderTimes,
  getReminderSettings,
};
