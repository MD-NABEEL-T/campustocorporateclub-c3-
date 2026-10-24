import User from '../models/User.js';
import AdminAudit from '../models/AdminAudit.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail.js';
import { isOwnerUser } from '../middleware/authMiddleware.js';
import { getAttendanceCutoff, getStartOfDayUTC } from '../utils/attendanceStats.js';

// Get all pending (unapproved) users - admin only
export const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all approved members - admin only
export const getApprovedUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: true })
      .select('-password')
      .populate('attendanceStartSetBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all attendees for session attendance (approved accounts regardless of role) - staff / admin
export const getAttendees = async (req, res) => {
  try {
    const attendees = await User.find({
      $or: [{ isApproved: true }, { role: 'admin' }],
    })
      .select('_id name email registerNumber year section role createdAt attendanceStartDate')
      .sort({ name: 1 })
      .lean();

    const results = attendees.map((attendee) => ({
      ...attendee,
      attendanceCutoff: getAttendanceCutoff(attendee).toISOString(),
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve a user - admin only
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = true;
    await user.save();

    const clientUrl = process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',')[0].trim().replace(/\/$/, '')
      : 'http://localhost:5173';

    // Send approval notification email to the member
    await sendEmail({
      to: user.email,
      subject: 'Welcome to C3! Your Account Has Been Approved',
      text: `Hello ${user.name},\n\nGreat news! Your account on the Campus to Corporate Club (C3) portal has been approved by the admin.\nYou can now log in to the C3 portal.\n\nLog in here: ${clientUrl}/login\n\nBest regards,\nCampus to Corporate Club (C3)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ffffff; margin-bottom: 16px;">Campus to Corporate Club (C3)</h2>
          <p style="color: #22c55e; font-size: 16px; font-weight: bold; margin-bottom: 12px;">🎉 Congratulations, ${user.name}!</p>
          <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
            Your account has been <strong>approved</strong> by the C3 Leadership & Admin Team.
          </p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
            You can now log in with your credentials to access the internal C3 member dashboard, peer sessions, attendance records, resources, and junior applicant profiles.
          </p>
          <div style="margin: 28px 0;">
            <a href="${clientUrl}/login" style="background: #ffffff; color: #000000; padding: 12px 24px; font-weight: bold; border-radius: 8px; text-decoration: none; font-size: 14px; display: inline-block;">
              Log In to C3 Portal
            </a>
          </div>
          <p style="color: #71717a; font-size: 12px; margin-top: 24px; border-top: 1px solid #27272a; padding-top: 16px;">
            CAHCET Computer Science and Engineering Department
          </p>
        </div>
      `,
    });

    res.json({ message: 'User approved and notified via email', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject / delete a pending user - admin only
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User registration declined and removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// In-memory wrong password failure tracker (5 attempts per 15 minutes per owner)
const ownerPasswordFailures = new Map();
const CHECK_FAIL_LIMIT = 5;
const FAIL_WINDOW_MS = 15 * 60 * 1000;

// Update user admin status (grant or revoke admin) - owner only
export const updateUserAdminStatus = async (req, res) => {
  try {
    const { makeAdmin, password } = req.body;
    if (typeof makeAdmin !== 'boolean' || !password) {
      return res.status(400).json({ message: 'makeAdmin (boolean) and password (string) are required' });
    }

    const ownerId = req.user._id.toString();
    const now = Date.now();
    const failureRecord = ownerPasswordFailures.get(ownerId);

    if (failureRecord && failureRecord.resetAt > now && failureRecord.count >= CHECK_FAIL_LIMIT) {
      const waitMin = Math.ceil((failureRecord.resetAt - now) / 60000);
      return res.status(403).json({
        message: `Too many failed password attempts. Please try again after ${waitMin} minute(s).`,
      });
    }

    // Verify owner password using User document
    const owner = await User.findById(req.user._id);
    if (!owner) {
      return res.status(403).json({ message: 'Owner account not found' });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      if (!failureRecord || failureRecord.resetAt <= now) {
        ownerPasswordFailures.set(ownerId, { count: 1, resetAt: now + FAIL_WINDOW_MS });
      } else {
        failureRecord.count += 1;
      }
      return res.status(403).json({ message: 'Invalid credentials. Action unauthorized.' });
    }

    // Successful password match resets failure counter
    ownerPasswordFailures.delete(ownerId);

    // Validate target user
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    if (!targetUser.isApproved) {
      return res.status(400).json({ message: 'Target user must be approved' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot modify your own administrative role' });
    }

    if (isOwnerUser(targetUser)) {
      return res.status(400).json({ message: 'Cannot modify the owner account' });
    }

    if (makeAdmin) {
      if (targetUser.role === 'admin') {
        return res.status(400).json({ message: 'Target user is already an admin' });
      }
      targetUser.role = 'admin';
    } else {
      if (targetUser.role !== 'admin') {
        return res.status(400).json({ message: 'Target user is not currently an admin' });
      }
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot remove admin: portal must have at least one active admin' });
      }
      targetUser.role = 'member';
    }

    await targetUser.save();

    // Log to AdminAudit collection
    try {
      await AdminAudit.create({
        action: makeAdmin ? 'grant_admin' : 'revoke_admin',
        actor: req.user._id,
        target: targetUser._id,
        targetName: targetUser.name,
        targetEmail: targetUser.email,
      });
    } catch (auditErr) {
      console.error('[AdminAudit] Failed to create audit log entry:', auditErr.message);
    }

    // Send email notification to the target user (role change still succeeds if email fails)
    try {
      const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : '';
      const loginHtml = clientUrl
        ? `<div style="margin: 24px 0;"><a href="${clientUrl}/login" style="background: #ffffff; color: #000000; padding: 12px 24px; font-weight: bold; border-radius: 8px; text-decoration: none; font-size: 14px; display: inline-block;">Log in to C3 Portal</a></div>`
        : '';
      const loginText = clientUrl ? `\n\nLog in here: ${clientUrl}/login` : '';

      if (makeAdmin) {
        await sendEmail({
          to: targetUser.email,
          subject: 'C3 Portal: You have been made an admin of the C3 portal',
          text: `Hello ${targetUser.name},\n\nYou have been made an admin of the C3 portal.${loginText}\n\nBest regards,\nCampus to Corporate Club (C3)`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
              <h2 style="color: #ffffff; margin-bottom: 16px;">Campus to Corporate Club (C3)</h2>
              <p style="color: #22c55e; font-size: 16px; font-weight: bold;">You have been made an admin of the C3 portal</p>
              <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
                The club owner has granted you administrative access to the C3 portal. You can now manage club sessions, review recruitment applicants, approve new members, and manage attendance records.
              </p>
              ${loginHtml}
              <p style="color: #71717a; font-size: 12px; margin-top: 24px;">CAHCET Computer Science and Engineering Department</p>
            </div>
          `,
        });
      } else {
        await sendEmail({
          to: targetUser.email,
          subject: 'C3 Portal: Your admin access has been removed',
          text: `Hello ${targetUser.name},\n\nYour admin access has been removed.${loginText}\n\nBest regards,\nCampus to Corporate Club (C3)`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
              <h2 style="color: #ffffff; margin-bottom: 16px;">Campus to Corporate Club (C3)</h2>
              <p style="color: #ef4444; font-size: 16px; font-weight: bold;">Your admin access has been removed</p>
              <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
                Your account role on the C3 portal has been updated back to Member. You will continue to have access to member sessions and features.
              </p>
              ${loginHtml}
              <p style="color: #71717a; font-size: 12px; margin-top: 24px;">CAHCET Computer Science and Engineering Department</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error('[AdminEmail] Error sending role update email:', emailErr.message);
    }

    const updatedUser = await User.findById(targetUser._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get admin audit logs - owner only
export const getAdminAuditLogs = async (req, res) => {
  try {
    const logs = await AdminAudit.find()
      .populate('actor', 'name email')
      .populate('target', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/:id/role - Update user role between member and coordinator (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || (role !== 'member' && role !== 'coordinator')) {
      return res.status(400).json({
        message: "Invalid role specified. Role must be either 'member' or 'coordinator'",
      });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'Target user not found' });
    }

    if (!targetUser.isApproved) {
      return res.status(400).json({ message: 'Target user must be an approved account' });
    }

    if (targetUser.role === 'admin' || isOwnerUser(targetUser)) {
      return res.status(400).json({ message: 'Cannot modify administrative roles through this endpoint' });
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot modify your own role' });
    }

    if (targetUser.role === role) {
      return res.status(400).json({ message: `Target user is already a ${role}` });
    }

    const action = role === 'coordinator' ? 'grant_coordinator' : 'revoke_coordinator';
    targetUser.role = role;
    await targetUser.save();

    // Log to AdminAudit
    try {
      await AdminAudit.create({
        action,
        actor: req.user._id,
        target: targetUser._id,
        targetName: targetUser.name,
        targetEmail: targetUser.email,
      });
    } catch (auditErr) {
      console.error('[AdminAudit] Failed to create audit log entry:', auditErr.message);
    }

    const updated = await User.findById(targetUser._id).select('-password');
    res.json({
      message: `User role successfully updated to ${role}`,
      user: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/:id/attendance-start (staffOnly)
// Body: { date: 'YYYY-MM-DD' | null }
export const updateAttendanceStartDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.isApproved && user.role !== 'admin') {
      return res.status(400).json({ message: 'Target user account is not approved' });
    }

    if (date !== null && date !== undefined) {
      if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format or null' });
      }

      const d = new Date(date + 'T00:00:00.000Z');
      if (isNaN(d.getTime())) {
        return res.status(400).json({ message: 'Invalid date provided' });
      }

      const todayUTC = getStartOfDayUTC(new Date());
      const minDate = new Date('2020-01-01T00:00:00.000Z');

      if (d > todayUTC) {
        return res.status(400).json({ message: 'Attendance start date cannot be in the future' });
      }
      if (d < minDate) {
        return res.status(400).json({ message: 'Attendance start date cannot be before 2020-01-01' });
      }

      user.attendanceStartDate = d;
      user.attendanceStartSetBy = req.user._id;
      user.attendanceStartSetAt = new Date();
    } else {
      user.attendanceStartDate = null;
      user.attendanceStartSetBy = null;
      user.attendanceStartSetAt = null;
    }

    await user.save();
    await user.populate('attendanceStartSetBy', 'name email');

    res.json({
      message: date ? 'Attendance start date updated successfully' : 'Attendance start date reset to default',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        attendanceStartDate: user.attendanceStartDate,
        attendanceStartSetBy: user.attendanceStartSetBy,
        attendanceStartSetAt: user.attendanceStartSetAt,
        attendanceCutoff: getAttendanceCutoff(user).toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/users/attendance-start/bulk (adminOnly)
// Body: { date: 'YYYY-MM-DD', dryRun?: boolean }
export const bulkUpdateAttendanceStartDate = async (req, res) => {
  try {
    const { date, dryRun } = req.body;

    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: 'Date must be in YYYY-MM-DD format' });
    }

    const targetDate = new Date(date + 'T00:00:00.000Z');
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date provided' });
    }

    const todayUTC = getStartOfDayUTC(new Date());
    const minDate = new Date('2020-01-01T00:00:00.000Z');

    if (targetDate > todayUTC) {
      return res.status(400).json({ message: 'Attendance start date cannot be in the future' });
    }
    if (targetDate < minDate) {
      return res.status(400).json({ message: 'Attendance start date cannot be before 2020-01-01' });
    }

    // Every approved account (and admins) whose effective cutoff is later than targetDate
    const approvedUsers = await User.find({
      $or: [{ isApproved: true }, { role: 'admin' }],
    }).select('_id createdAt attendanceStartDate');

    const usersToUpdate = approvedUsers.filter((u) => {
      const currentCutoff = getAttendanceCutoff(u);
      return currentCutoff > targetDate;
    });

    const count = usersToUpdate.length;

    if (dryRun) {
      return res.json({ count, dryRun: true });
    }

    if (count > 0) {
      const userIds = usersToUpdate.map((u) => u._id);
      await User.updateMany(
        { _id: { $in: userIds } },
        {
          $set: {
            attendanceStartDate: targetDate,
            attendanceStartSetBy: req.user._id,
            attendanceStartSetAt: new Date(),
          },
        }
      );
    }

    res.json({
      count,
      dryRun: false,
      message: `Successfully updated attendance start date for ${count} members`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
