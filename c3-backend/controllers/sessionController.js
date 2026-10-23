import mongoose from 'mongoose';
import Session from '../models/Session.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return matches ? matches[1] : null;
};

// Create a session - admin only
export const createSession = async (req, res) => {
  try {
    const { date, topic, type, handledBy, summary } = req.body;
    if (!req.files || !req.files.coverImage) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    const coverImage = req.files.coverImage[0].path; // Cloudinary URL
    const images = req.files.images ? req.files.images.map(f => f.path) : [];

    const session = await Session.create({
      date,
      topic,
      type,
      handledBy,
      summary,
      coverImage,
      images,
      createdBy: req.user._id,
      absentees: [],
    });

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all sessions - any logged in user
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single session by ID
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('attendanceMarkedBy', 'name email')
      .lean();
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Return absentees in ONE consistent shape: plain ID strings
    session.absentees = (session.absentees || []).map((abs) =>
      String(abs?._id ?? abs)
    );

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update absentees for a session - admin only
export const markAbsentees = async (req, res) => {
  try {
    const { absentees } = req.body;

    if (!Array.isArray(absentees)) {
      return res.status(400).json({ message: 'Absentees must be an array of member IDs' });
    }

    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Normalize and de-duplicate ID strings
    const uniqueAbsentees = Array.from(
      new Set(absentees.map((id) => String(id?._id ?? id).trim()).filter(Boolean))
    );

    // Validate that every id is a valid ObjectId and corresponds to an approved user (any role)
    if (uniqueAbsentees.length > 0) {
      const invalidId = uniqueAbsentees.some((id) => !mongoose.isValidObjectId(id));
      if (invalidId) {
        return res.status(400).json({ message: 'Invalid member ID format in absentees list' });
      }

      const approvedCount = await User.countDocuments({
        _id: { $in: uniqueAbsentees },
        $or: [{ isApproved: true }, { role: 'admin' }],
      });

      if (approvedCount !== uniqueAbsentees.length) {
        return res.status(400).json({ message: 'One or more absentee IDs are unknown or not approved' });
      }

      // Store de-duplicated ObjectIds in MongoDB
      session.absentees = uniqueAbsentees.map((id) => new mongoose.Types.ObjectId(id));
    } else {
      session.absentees = [];
    }

    session.attendanceMarkedBy = req.user._id;
    session.attendanceMarkedAt = new Date();

    await session.save();
    await session.populate('attendanceMarkedBy', 'name email');

    const result = session.toObject();
    // Return absentees in ONE consistent shape: plain ID strings
    result.absentees = (result.absentees || []).map((abs) =>
      String(abs?._id ?? abs)
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit session details (including summary, date, status) - admin only
export const updateSession = async (req, res) => {
  try {
    const { topic, type, handledBy, summary, date, status } = req.body;

    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (topic !== undefined) session.topic = topic;
    if (type !== undefined) session.type = type;
    if (handledBy !== undefined) session.handledBy = handledBy;
    if (summary !== undefined) session.summary = summary;
    if (date !== undefined && date !== '') session.date = date;
    if (status !== undefined) session.status = status;

    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
      const oldCoverPublicId = getPublicIdFromUrl(session.coverImage);
      if (oldCoverPublicId) {
        try {
          await cloudinary.uploader.destroy(oldCoverPublicId);
        } catch (cloudErr) {
          console.error('Failed to delete old cover image from Cloudinary:', cloudErr);
        }
      }
      session.coverImage = req.files.coverImage[0].path;
    }

    if (req.files && req.files.images && req.files.images.length > 0) {
      for (const imgUrl of session.images || []) {
        const publicId = getPublicIdFromUrl(imgUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudErr) {
            console.error('Failed to delete old gallery image from Cloudinary:', cloudErr);
          }
        }
      }
      session.images = req.files.images.map((f) => f.path);
    }

    // Do NOT clear absentees or attendanceMarkedBy / attendanceMarkedAt
    await session.save();
    const result = session.toObject();
    result.absentees = (result.absentees || []).map((abs) =>
      String(abs?._id ?? abs)
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete session - admin only
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Remove images from Cloudinary
    const imagesToDelete = [session.coverImage, ...(session.images || [])].filter(Boolean);
    for (const url of imagesToDelete) {
      const publicId = getPublicIdFromUrl(url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.error(`Failed to delete Cloudinary image (${publicId}):`, cloudErr);
        }
      }
    }

    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};