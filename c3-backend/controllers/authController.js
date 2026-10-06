import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1095d' }); // ~3 years
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, year, section, registerNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      year: year ? Number(year) : undefined,
      section,
      registerNumber,
      role: 'member',
      isApproved: false,
    });

    // Notify member via email
    await sendEmail({
      to: email,
      subject: 'C3 Membership Registration Received - Pending Approval',
      text: `Hello ${name},\n\nThank you for registering for the Campus to Corporate Club (C3) portal.\nYour account has been created and is currently awaiting admin verification.\nYou will receive another email as soon as an admin approves your account.\n\nBest regards,\nCampus to Corporate Club (C3)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #27272a;">
          <h2 style="color: #ffffff; margin-bottom: 16px;">Campus to Corporate Club (C3)</h2>
          <p style="color: #d4d4d8; font-size: 15px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
            Your registration for the C3 Member Portal has been received and is currently <strong>pending admin approval</strong>.
          </p>
          <div style="background: #18181b; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #3f3f46;">
            <p style="margin: 0; color: #e4e4e7; font-size: 13px;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 6px 0 0 0; color: #e4e4e7; font-size: 13px;"><strong>Email:</strong> ${email}</p>
            ${section ? `<p style="margin: 6px 0 0 0; color: #e4e4e7; font-size: 13px;"><strong>Section:</strong> ${section}</p>` : ''}
          </div>
          <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
            You will receive a confirmation email with access details as soon as a C3 coordinator reviews and approves your account.
          </p>
          <p style="color: #71717a; font-size: 12px; margin-top: 24px;">CAHCET Computer Science and Engineering Department</p>
        </div>
      `,
    });

    // Notify Admin
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New C3 Member Registration: ${name}`,
        text: `A new member (${name}, ${email}, ${section || 'N/A'}) has registered on the C3 portal and requires approval.\nPlease review in the Admin Dashboard.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #000; color: #fff;">
            <h3>New Member Registration Awaiting Approval</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Section:</strong> ${section || 'N/A'}</p>
            <p><strong>Register No:</strong> ${registerNumber || 'N/A'}</p>
            <p>Please log in to the C3 Admin Dashboard to approve or decline this request.</p>
          </div>
        `,
      });
    }

    res.status(201).json({
      message: 'Registration submitted successfully! Your account is pending admin approval. You will receive an email once approved.',
      isPendingApproval: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(403).json({
        message: 'Your account is pending admin approval. You will receive an email once approved by a C3 Admin.',
        isPendingApproval: true,
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};