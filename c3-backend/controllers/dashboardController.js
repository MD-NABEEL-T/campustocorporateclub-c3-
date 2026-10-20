import User from '../models/User.js';
import Session from '../models/Session.js';
import Event from '../models/Event.js';
import Application from '../models/Application.js';
import {
  calculateMemberAttendance,
  LOW_ATTENDANCE_THRESHOLD,
  getStartOfDayUTC,
} from '../utils/attendanceStats.js';
import { getSessionAnnouncements } from '../utils/dateUtils.js';

const sanitizeSessionAnnouncement = (s) => {
  if (!s) return null;
  return {
    _id: s._id,
    topic: s.topic || '',
    handledBy: s.handledBy || '',
    time: s.time || '',
    startTime: s.startTime || '',
    endTime: s.endTime || '',
    venue: s.venue || '',
    message: s.message || '',
    status: s.status || 'scheduled',
    cancelReason: s.cancelReason || '',
    editedAt: s.editedAt || null,
    updatedAt: s.updatedAt || null,
    date: s.date || null,
  };
};

export const getDashboardData = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const now = new Date();
    const userCutoff = getStartOfDayUTC(user.createdAt || now);

    // Queries common to everyone (members and admins)
    const baseQueries = [
      // 0: member attendance (includes percentage, totalSessions, history, currentStreak)
      calculateMemberAttendance(user),

      // 1: announcements (broadcasts limited to latest 5)
      getSessionAnnouncements(5),

      // 2: latest 5 held sessions (not cancelled)
      Session.find({ status: { $ne: 'cancelled' } })
        .sort({ date: -1 })
        .limit(5)
        .select('_id date topic handledBy type absentees')
        .lean(),

      // 3: upcoming events (next 3 with date >= now)
      Event.find({ date: { $gte: now } })
        .sort({ date: 1 })
        .limit(3)
        .select('_id slug title date coverImage category')
        .lean(),

      // 4: recent events (latest 3 past events)
      Event.find({ date: { $lt: now } })
        .sort({ date: -1 })
        .limit(3)
        .select('_id slug title date coverImage category')
        .lean(),

      // 5: total held sessions
      Session.countDocuments({ status: { $ne: 'cancelled' } }),

      // 6: total events
      Event.countDocuments(),

      // 7: total approved members
      User.countDocuments({ isApproved: true }),
    ];

    // If Admin, append admin queries to execute concurrently
    if (user.role === 'admin') {
      baseQueries.push(
        // 8: pending approvals count
        User.countDocuments({ isApproved: false }),
        // 9: pending applications count (never drafts)
        Application.countDocuments({ status: 'pending' }),
        // 10: recent applications (latest 5 non-draft)
        Application.find({ status: { $ne: 'draft' } })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('fullName preferredDomain year status createdAt')
          .lean(),
        // 11: approved members for attendance calculation
        User.find({ isApproved: true })
          .select('_id name email section year createdAt')
          .lean(),
        // 12: all held sessions for attendance calculation
        Session.find({ status: { $ne: 'cancelled' } })
          .select('_id date absentees')
          .lean()
      );
    }

    const results = await Promise.all(baseQueries);

    const attendance = results[0];
    const announcementsData = results[1];
    const rawRecentSessions = results[2];
    const upcomingEvents = results[3];
    const recentEvents = results[4];
    const totalSessions = results[5];
    const totalEvents = results[6];
    const totalMembers = results[7];

    const me = {
      name: user.name || '',
      year: user.year || null,
      section: user.section || '',
      role: user.role || 'member',
    };

    const recentSessions = (rawRecentSessions || []).map((s) => {
      const isBeforeAccount = new Date(s.date) < userCutoff;
      let myStatus = null;
      if (!isBeforeAccount) {
        const isAbsent = s.absentees?.some(
          (absId) => absId.toString() === user._id.toString()
        );
        myStatus = isAbsent ? 'absent' : 'present';
      }
      return {
        _id: s._id,
        date: s.date,
        topic: s.topic,
        handledBy: s.handledBy,
        type: s.type,
        myStatus,
      };
    });

    const events = {
      upcoming: upcomingEvents || [],
      recent: recentEvents || [],
    };

    const club = {
      totalSessions,
      totalEvents,
      totalMembers,
    };

    const todaySession = sanitizeSessionAnnouncement(announcementsData?.todaySession);
    const upcomingSession = sanitizeSessionAnnouncement(announcementsData?.upcomingSession);
    const broadcasts = announcementsData?.broadcasts || [];

    // Admin Payload
    if (user.role === 'admin') {
      const pendingApprovalsCount = results[8];
      const pendingApplicationsCount = results[9];
      const recentApplications = results[10];
      const approvedMembers = results[11];
      const allHeldSessions = results[12];

      let lowAttendanceMembers = [];
      if (allHeldSessions.length > 0 && approvedMembers.length > 0) {
        const attendanceResults = approvedMembers
          .map((member) => {
            const cutoff = getStartOfDayUTC(member.createdAt);
            const eligible = allHeldSessions.filter((s) => new Date(s.date) >= cutoff);
            const total = eligible.length;
            if (total === 0) return null; // Skip members with null percentage (0 sessions)

            const absent = eligible.filter((s) =>
              s.absentees?.some((id) => id.toString() === member._id.toString())
            ).length;
            const present = total - absent;
            const percentage = Number(((present / total) * 100).toFixed(1));

            return {
              _id: member._id,
              name: member.name,
              email: member.email,
              section: member.section || 'CSE',
              year: member.year,
              totalSessions: total,
              presentCount: present,
              absentCount: absent,
              percentage,
            };
          })
          .filter(Boolean);

        const belowThreshold = attendanceResults.filter(
          (m) => m.percentage < LOW_ATTENDANCE_THRESHOLD
        );

        belowThreshold.sort((a, b) => a.percentage - b.percentage);
        lowAttendanceMembers = belowThreshold;
      }

      return res.json({
        role: 'admin',
        me,
        attendance,
        todaySession,
        upcomingSession,
        broadcasts,
        recentSessions,
        events,
        club,
        pending: {
          memberApprovals: pendingApprovalsCount,
          applications: pendingApplicationsCount,
        },
        recentApplications: recentApplications || [],
        lowAttendanceMembers,
        counts: {
          pendingApprovals: pendingApprovalsCount,
          pendingApplications: pendingApplicationsCount,
          totalSessions,
          totalEvents,
          totalMembers,
        },
      });
    }

    // Member Payload (strictly no pending, recentApplications, or lowAttendanceMembers)
    return res.json({
      role: 'member',
      me,
      attendance,
      todaySession,
      upcomingSession,
      broadcasts,
      recentSessions,
      events,
      club,
    });
  } catch (err) {
    console.error('getDashboardData error:', err);
    res.status(500).json({ message: err.message || 'Failed to retrieve dashboard data' });
  }
};
