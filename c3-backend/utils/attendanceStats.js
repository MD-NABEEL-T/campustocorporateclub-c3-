import Session from '../models/Session.js';

export const LOW_ATTENDANCE_THRESHOLD = 75;

/**
 * Normalizes any date to UTC start-of-day (00:00:00.000Z).
 * Ensures sessions recorded with date-only strings (e.g. "2026-10-16")
 * on the day a member joined are included in attendance calculations.
 */
export const getStartOfDayUTC = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Calculates member attendance metrics:
 * - Count only sessions with date >= start-of-day of user's account createdAt in UTC
 * - Response format:
 *   totalSessions: number
 *   presentCount: number
 *   absentCount: number
 *   percentage: number rounded to 1 decimal place, or null if totalSessions === 0
 *   currentStreak: number of consecutive most-recent sessions present
 *   history: last 10 eligible sessions as [{ _id, date, topic, status: 'present' | 'absent' }] newest first
 */
export const calculateMemberAttendance = async (user) => {
  if (!user || !user._id) {
    return {
      totalSessions: 0,
      presentCount: 0,
      absentCount: 0,
      percentage: null,
      currentStreak: 0,
      history: [],
    };
  }

  const memberIdStr = user._id.toString();
  const cutoffDate = getStartOfDayUTC(user.createdAt || new Date());

  // Find all sessions on or after member joined, newest first
  const sessions = await Session.find({ date: { $gte: cutoffDate } })
    .sort({ date: -1 })
    .select('_id date topic absentees');

  const totalSessions = sessions.length;
  let absentCount = 0;
  let currentStreak = 0;
  let streakBroken = false;

  const history = sessions.slice(0, 10).map((session) => {
    const isAbsent = session.absentees?.some(
      (absenteeId) => absenteeId.toString() === memberIdStr
    );
    return {
      _id: session._id,
      date: session.date,
      topic: session.topic,
      status: isAbsent ? 'absent' : 'present',
    };
  });

  for (let i = 0; i < sessions.length; i++) {
    const isAbsent = sessions[i].absentees?.some(
      (absenteeId) => absenteeId.toString() === memberIdStr
    );

    if (isAbsent) {
      absentCount++;
      streakBroken = true;
    } else if (!streakBroken) {
      currentStreak++;
    }
  }

  const presentCount = totalSessions - absentCount;
  const percentage =
    totalSessions === 0
      ? null
      : Number(((presentCount / totalSessions) * 100).toFixed(1));

  return {
    totalSessions,
    presentCount,
    absentCount,
    percentage,
    currentStreak,
    history,
  };
};
