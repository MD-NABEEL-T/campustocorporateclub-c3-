import Announcement from '../models/Announcement.js';

// GET /api/announcements - Fetch active today's session and recent broadcasts
export const getAnnouncements = async (req, res) => {
  try {
    const todaySession = await Announcement.findOne({
      type: 'today_session',
      isActive: true,
    }).sort({ updatedAt: -1 });

    const broadcasts = await Announcement.find({
      type: 'broadcast',
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      todaySession: todaySession || null,
      broadcasts: broadcasts || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/announcements/today-session - Admin set / update today's upcoming session details
export const updateTodaySession = async (req, res) => {
  try {
    const { topic, handledBy, time, venue, message } = req.body;

    if (!topic || !handledBy) {
      return res.status(400).json({ message: 'Topic and Handled By are required' });
    }

    // Deactivate previous today_session announcements
    await Announcement.updateMany({ type: 'today_session' }, { isActive: false });

    // Create fresh active today session announcement
    const sessionAnnouncement = await Announcement.create({
      type: 'today_session',
      title: "Today's Peer Session",
      topic: topic.trim(),
      handledBy: handledBy.trim(),
      time: time ? time.trim() : '4:30 PM - 5:00 PM (30 Mins)',
      venue: venue ? venue.trim() : 'CSE Lab / Department Hall',
      message: message ? message.trim() : '',
      isActive: true,
      createdBy: req.user._id,
      date: new Date(),
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
