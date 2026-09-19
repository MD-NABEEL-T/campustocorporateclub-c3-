import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

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
    const users = await User.find({ isApproved: true }).select('-password').sort({ createdAt: -1 });
    res.json(users);
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

    // Send approval notification email to the member
    await sendEmail({
      to: user.email,
      subject: 'Welcome to C3! Your Account Has Been Approved',
      text: `Hello ${user.name},\n\nGreat news! Your account on the Campus to Corporate Club (C3) portal has been approved by the admin.\nYou can now log in to the C3 portal.\n\nBest regards,\nCampus to Corporate Club (C3)`,
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
            <a href="http://localhost:5173/login" style="background: #ffffff; color: #000000; padding: 12px 24px; font-weight: bold; border-radius: 8px; text-decoration: none; font-size: 14px; display: inline-block;">
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