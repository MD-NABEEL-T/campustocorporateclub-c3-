import User from '../models/User.js';
import Session from '../models/Session.js';
import { calculateMemberAttendance, getStartOfDayUTC, getAttendanceCutoff } from '../utils/attendanceStats.js';

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
    const isStaff = req.user.role === 'admin' || req.user.role === 'coordinator';

    // Strict ownership & role check
    if (!isSelf && !isStaff) {
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
    const ownerEmail = (process.env.OWNER_EMAIL || '').trim().toLowerCase();

    try {
      // Primary attempt: Single MongoDB aggregation using $dateTrunc with timezone "UTC"
      results = await User.aggregate([
        { $match: { $or: [{ isApproved: true }, { role: 'admin' }] } },
        {
          $lookup: {
            from: 'sessions',
            let: {
              userId: '$_id',
              userEffectiveDate: { $ifNull: ['$attendanceStartDate', '$createdAt'] },
            },
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      $expr: {
                        $gte: [
                          '$date',
                          { $dateTrunc: { date: '$$userEffectiveDate', unit: 'day', timezone: 'UTC' } },
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
          $lookup: {
            from: 'users',
            localField: 'attendanceStartSetBy',
            foreignField: '_id',
            as: 'setByUser',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            section: 1,
            year: 1,
            createdAt: 1,
            attendanceStartDate: 1,
            attendanceStartSetAt: 1,
            attendanceStartSetBy: {
              $let: {
                vars: { firstUser: { $arrayElemAt: ['$setByUser', 0] } },
                in: {
                  $cond: {
                    if: { $gt: [{ $size: '$setByUser' }, 0] },
                    then: {
                      _id: '$$firstUser._id',
                      name: '$$firstUser.name',
                      email: '$$firstUser.email',
                    },
                    else: null,
                  },
                },
              },
            },
            role: { $ifNull: ['$role', 'member'] },
            isOwner: {
              $and: [
                { $ne: [ownerEmail, ''] },
                { $eq: [{ $toLower: '$email' }, ownerEmail] },
                { $eq: ['$role', 'admin'] },
              ],
            },
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
        .select('name email section year role createdAt attendanceStartDate attendanceStartSetBy attendanceStartSetAt')
        .populate('attendanceStartSetBy', 'name email')
        .sort({ name: 1 });
      const sessions = await Session.find({ status: { $ne: 'cancelled' } }).select('_id date absentees');

      results = members.map((member) => {
        const cutoff = getAttendanceCutoff(member);
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
          createdAt: member.createdAt,
          attendanceStartDate: member.attendanceStartDate,
          attendanceStartSetBy: member.attendanceStartSetBy,
          attendanceStartSetAt: member.attendanceStartSetAt,
          isOwner: Boolean(
            ownerEmail &&
            member.role === 'admin' &&
            (member.email || '').trim().toLowerCase() === ownerEmail
          ),
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