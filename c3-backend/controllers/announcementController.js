import Announcement from '../models/Announcement.js';
import {
  getSessionAnnouncements,
  getKolkataDayBounds,
  parseSessionStorageDate,
} from '../utils/dateUtils.js';

// GET /api/announcements - Fetch active today's session, nearest upcoming session, and recent broadcasts
export const getAnnouncements = async (req, res) => {
  try {
    const data = await getSessionAnnouncements();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/announcements/today-session - Admin set / update session details for today or a future date
export const updateTodaySession = async (req, res) => {
  try {
    const { topic, handledBy, time, venue, message, date } = req.body;

    if (!topic || !handledBy) {
      return res.status(400).json({ message: 'Topic and Handled By are required' });
    }

    // Parse target date: if YYYY-MM-DD, stored as IST noon (12:00:00+05:30) so it never rolls over to previous day in UTC
    const sessionStorageDate = parseSessionStorageDate(date);
    const { startOfDay, endOfDay } = getKolkataDayBounds(sessionStorageDate);

    // Deactivate previous today_session announcements on this specific calendar day only
    await Announcement.updateMany(
      {
        type: 'today_session',
        date: { $gte: startOfDay, $lte: endOfDay },
      },
      { isActive: false }
    );

    // Create fresh active session announcement without hardcoded time/venue defaults
    const sessionAnnouncement = await Announcement.create({
      type: 'today_session',
      title: "Today's Peer Session",
      topic: topic.trim(),
      handledBy: handledBy.trim(),
      time: time ? time.trim() : '',
      venue: venue ? venue.trim() : '',
      message: message ? message.trim() : '',
      isActive: true,
      createdBy: req.user._id,
      date: sessionStorageDate,
    });

    res.status(201).json({
      message: "Today's session announcement updated successfully",
      sessionAnnouncement,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/announcements/broadcast - Admin post a new club broadcast
export const createBroadcast = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const broadcast = await Announcement.create({
      type: 'broadcast',
      title: title.trim(),
      message: message.trim(),
      isActive: true,
      createdBy: req.user._id,
      date: new Date(),
    });

    res.status(201).json({
      message: 'Broadcast published successfully',
      broadcast,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/announcements/:id - Admin delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
