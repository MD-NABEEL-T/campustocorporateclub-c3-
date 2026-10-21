import User from '../models/User.js';
import Session from '../models/Session.js';
import { calculateMemberAttendance, getStartOfDayUTC } from '../utils/attendanceStats.js';

// GET /api/attendance/me - Authenticated member's own attendance stats
export const getMyAttendance = async (req, res) => {
  try {
    const stats = await calculateMemberAttendance(req.user);
    res.json(stats);
  } catch (err) {
    console.error('getMyAttendance error:', err);
    res.status(500).json({ message: err.message || 'Failed to calculate attendance' });
  }
};

// GET /api/attendance/:memberId - Single member attendance stats (Admin or self only)
export const getMemberAttendance = async (req, res) => {
  try {
    const targetId = req.params.memberId;
    const isSelf = targetId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Strict ownership & role check
    if (!isSelf && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }

    const targetUser = isSelf ? req.user : await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const stats = await calculateMemberAttendance(targetUser);
    res.json(stats);
  } catch (err) {
    console.error('getMemberAttendance error:', err);
    res.status(500).json({ message: err.message || 'Failed to calculate attendance' });
  }
};

// GET /api/attendance/all - Admin only attendance overview for all approved members
export const getAllAttendance = async (req, res) => {
  try {
    let results;

    try {
      // Primary attempt: Single MongoDB aggregation using $dateTrunc with timezone "UTC"
      results = await User.aggregate([
        { $match: { $or: [{ isApproved: true }, { role: 'admin' }] } },
        {
          $lookup: {
            from: 'sessions',
            let: {
              userId: '$_id',
              userCreatedAt: '$createdAt',
            },
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      $expr: {
                        $gte: [
                          '$date',
                          { $dateTrunc: { date: '$$userCreatedAt', unit: 'day', timezone: 'UTC' } },
                        ],
                      },
                    },
                    {
                      status: { $ne: 'cancelled' },
                    },
                  ],
                },
              },
              {
                $project: {
                  _id: 1,
                  isAbsent: {
                    $in: ['$$userId', { $ifNull: ['$absentees', []] }],
                  },
                },
              },
            ],
            as: 'eligibleSessions',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            section: 1,
            year: 1,
            role: 1,
            totalSessions: { $size: '$eligibleSessions' },
            absentCount: {
              $size: {
                $filter: {
                  input: '$eligibleSessions',
                  as: 's',
                  cond: { $eq: ['$$s.isAbsent', true] },
                },
              },
            },
          },
        },
        {
          $addFields: {
            presentCount: { $subtract: ['$totalSessions', '$absentCount'] },
            percentage: {
              $cond: {
                if: { $eq: ['$totalSessions', 0] },
                then: null,
                else: {
                  $round: [
                    {
                      $multiply: [
                        {
                          $divide: [
                            { $subtract: ['$totalSessions', '$absentCount'] },
                            '$totalSessions',
                          ],
                        },
                        100,
                      ],
                    },
                    1,
                  ],
                },
              },
            },
          },
        },
        { $sort: { name: 1 } },
      ]);
    } catch (aggErr) {
      // Fallback: If $dateTrunc is not supported in MongoDB version, compute cutoff in JS
      const members = await User.find({
        $or: [{ isApproved: true }, { role: 'admin' }],
      })
        .select('name email section year role createdAt')
        .sort({ name: 1 });
      const sessions = await Session.find({ status: { $ne: 'cancelled' } }).select('_id date absentees');

      results = members.map((member) => {
        const cutoff = getStartOfDayUTC(member.createdAt);
        const eligible = sessions.filter((s) => new Date(s.date) >= cutoff);
        const totalSessions = eligible.length;
        const absentCount = eligible.filter((s) =>
          s.absentees?.some((id) => String(id?._id ?? id) === String(member._id))
        ).length;
        const presentCount = totalSessions - absentCount;
        const percentage =
          totalSessions === 0
            ? null
            : Number(((presentCount / totalSessions) * 100).toFixed(1));

        return {
          _id: member._id,
          name: member.name,
          email: member.email,
          section: member.section,
          year: member.year,
          role: member.role || 'member',
          totalSessions,
          presentCount,
          absentCount,
          percentage,
        };
      });
    }

    res.json(results);
  } catch (err) {
    console.error('getAllAttendance error:', err);
    res.status(500).json({ message: err.message || 'Failed to retrieve attendance overview' });
  }
};