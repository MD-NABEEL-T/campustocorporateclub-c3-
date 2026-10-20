import Announcement from '../models/Announcement.js';

export const TIMEZONE_KOLKATA = 'Asia/Kolkata';

/**
 * Returns YYYY-MM-DD date string in Asia/Kolkata for a given Date / string / timestamp.
 */
export const getKolkataDateString = (date = new Date()) => {
  const d = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())
    ? new Date(`${date.trim()}T12:00:00.000+05:30`)
    : new Date(date);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_KOLKATA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d);
};

/**
 * Computes the UTC startOfDay (00:00:00.000 IST) and endOfDay (23:59:59.999 IST)
 * for any given date in Asia/Kolkata.
 */
export const getKolkataDayBounds = (date = new Date()) => {
  const dateStr = getKolkataDateString(date);
  const startOfDay = new Date(`${dateStr}T00:00:00.000+05:30`);
  const endOfDay = new Date(`${dateStr}T23:59:59.999+05:30`);
  return { dateStr, startOfDay, endOfDay };
};

/**
 * Given an optional date input (YYYY-MM-DD or full date/time), returns the Date object to store.
 * If date is YYYY-MM-DD, stores as IST noon (12:00:00.000+05:30 = 06:30:00.000Z),
 * which can never fall on the previous day in UTC or IST.
 * If date is omitted or empty, defaults to current timestamp (new Date()).
 */
export const parseSessionStorageDate = (date) => {
  if (!date) {
    return new Date();
  }
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
    return new Date(`${date.trim()}T12:00:00.000+05:30`);
  }
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

/**
 * Shared announcement query helper used by both announcementController and dashboardController.
 */
export const getSessionAnnouncements = async (broadcastLimit = 10) => {
  const { startOfDay, endOfDay } = getKolkataDayBounds(new Date());

  const [todaySession, upcomingSession, broadcasts] = await Promise.all([
    // Active today_session whose date falls on the current day in Asia/Kolkata
    Announcement.findOne({
      type: 'today_session',
      isActive: true,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ updatedAt: -1 })
      .lean(),

    // Nearest active today_session whose date is strictly after today
    Announcement.findOne({
      type: 'today_session',
      isActive: true,
      date: { $gt: endOfDay },
    })
      .sort({ date: 1 })
      .lean(),

    // Broadcasts
    Announcement.find({
      type: 'broadcast',
    })
      .sort({ createdAt: -1 })
      .limit(broadcastLimit)
      .lean(),
  ]);

  return {
    todaySession: todaySession || null,
    upcomingSession: upcomingSession || null,
    broadcasts: broadcasts || [],
  };
};

/**
 * Converts a 24-hour "HH:mm" time string into a 12-hour format string (e.g. "13:05" -> "1:05 PM").
 */
export const formatTimeDisplay = (time24) => {
  if (!time24 || typeof time24 !== 'string') return '';
  const trimmed = time24.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return trimmed;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  if (isNaN(hours)) return trimmed;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Generates a human-friendly display time string from startTime and optional endTime,
 * falling back to custom time string if provided.
 */
export const generateDisplayTime = (time, startTime, endTime) => {
  if (startTime && startTime.trim()) {
    const startStr = formatTimeDisplay(startTime.trim());
    if (endTime && endTime.trim()) {
      const endStr = formatTimeDisplay(endTime.trim());
      return `${startStr} - ${endStr}`;
    }
    return startStr;
  }
  if (time && time.trim()) {
    return time.trim();
  }
  return '';
};

