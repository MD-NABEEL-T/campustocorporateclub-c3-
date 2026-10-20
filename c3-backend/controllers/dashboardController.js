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

export const getDashboardData = async (req, res) => {
  try {
    const user = req.user;

    // Shared announcements (uses same helper as announcementController)
    const { todaySession, upcomingSession, broadcasts } = await getSessionAnnouncements();

    // If Admin, build admin overview payload
    if (user.role === 'admin') {
      const [
        pendingApprovalsCount,
        pendingApplicationsCount,
        totalSessions,
        totalEvents,
        totalMembers,
        approvedMembers,
        recentApplications,
        allSessions,
      ] = await Promise.all([
        User.countDocuments({ isApproved: false }),
        Application.countDocuments({ status: 'pending' }),
        Session.countDocuments(),
        Event.countDocuments(),
        User.countDocuments({ isApproved: true }),
        User.find({ isApproved: true }).select('name email section year createdAt'),
        Application.find({ status: { $ne: 'draft' } })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('fullName preferredDomain year status createdAt section'),
        Session.find().select('_id date absentees'),
      ]);

      // Calculate low-attendance members strictly below threshold (e.g. < 75%)
      // Rules: Skip members with null percentage (0 sessions). If none below threshold, return []. No lowest-5 fallback.
      let lowAttendanceMembers = [];
      if (allSessions.length > 0 && approvedMembers.length > 0) {
        const attendanceResults = approvedMembers
          .map((member) => {
            const cutoff = getStartOfDayUTC(member.createdAt);
            const eligible = allSessions.filter((s) => new Date(s.date) >= cutoff);
            const total = eligible.length;
            if (total === 0) return null; // Skip members with null percentage (no sessions yet)

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
          .filter(Boolean); // Filter out nulls

        // Only include members strictly below the threshold
        const belowThreshold = attendanceResults.filter(
          (m) => m.percentage < LOW_ATTENDANCE_THRESHOLD
        );

        // Sort ascending (worst turnout first) and take up to 5
        belowThreshold.sort((a, b) => a.percentage - b.percentage);
        lowAttendanceMembers = belowThreshold.slice(0, 5);
      }

      return res.json({
        role: 'admin',
        counts: {
          pendingApprovals: pendingApprovalsCount,
          pendingApplications: pendingApplicationsCount,
          totalSessions,
          totalEvents,
          totalMembers,
        },
        todaySession: todaySession || null,
        upcomingSession: upcomingSession || null,
        broadcasts: broadcasts || [],
        lowAttendanceMembers,
        recentApplications: recentApplications || [],
      });
    }

    // If regular Member, return personal stats via reusable helper
    const attendance = await calculateMemberAttendance(user);

    return res.json({
      role: 'member',
      attendance,
      todaySession: todaySession || null,
      upcomingSession: upcomingSession || null,
      broadcasts: broadcasts || [],
    });
  } catch (err) {
    console.error('getDashboardData error:', err);
    res.status(500).json({ message: err.message || 'Failed to retrieve dashboard data' });
  }
};
