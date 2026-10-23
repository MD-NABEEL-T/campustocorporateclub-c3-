import Announcement from '../models/Announcement.js';
import {
  getSessionAnnouncements,
  getKolkataDayBounds,
  parseSessionStorageDate,
  generateDisplayTime,
} from '../utils/dateUtils.js';
import { broadcastPushNotification } from '../utils/pushNotificationService.js';

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
    const { topic, handledBy, time, venue, message, date, startTime, endTime } = req.body;

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

    const displayTime = generateDisplayTime(time, startTime, endTime);

    // Create fresh active session announcement without hardcoded time/venue defaults
    const sessionAnnouncement = await Announcement.create({
      type: 'today_session',
      title: "Today's Peer Session",
      topic: topic.trim(),
      handledBy: handledBy.trim(),
      startTime: startTime ? startTime.trim() : '',
      endTime: endTime ? endTime.trim() : '',
      time: displayTime,
      venue: venue ? venue.trim() : '',
      message: message ? message.trim() : '',
      status: 'scheduled',
      cancelReason: '',
      isActive: true,
      createdBy: req.user._id,
      date: sessionStorageDate,
    });

    // Send instant push notification to all members' devices
    broadcastPushNotification({
      title: `📢 New Session: ${topic.trim()}`,
      body: `${displayTime ? displayTime + ' • ' : ''}${venue ? 'Venue: ' + venue.trim() + ' • ' : ''}Handled by ${handledBy.trim()}`,
      data: { url: '/dashboard' },
    }).catch((err) => console.error('[Push] Failed to broadcast session notification:', err.message));

    res.status(201).json({
      message: "Today's session announcement updated successfully",
      sessionAnnouncement,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/announcements/:id/quick-edit - Quick update venue, startTime, endTime, message
export const quickEditAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const { venue, startTime, endTime, message, time } = req.body;

    if (venue !== undefined) {
      announcement.venue = venue.trim();
    }
    if (startTime !== undefined) {
      announcement.startTime = startTime.trim();
    }
    if (endTime !== undefined) {
      announcement.endTime = endTime.trim();
    }
    if (message !== undefined) {
      announcement.message = message.trim();
    }

    // If timing was provided or updated, regenerate display time
    if (startTime !== undefined || endTime !== undefined || time !== undefined) {
      const newDisplayTime = generateDisplayTime(
        time !== undefined ? time : announcement.time,
        announcement.startTime,
        announcement.endTime
      );
      announcement.time = newDisplayTime;
    }

    announcement.editedAt = new Date();
    announcement.updatedBy = req.user._id;

    await announcement.save();

    res.json({
      message: 'Announcement updated successfully',
      announcement,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/announcements/:id/cancel - Admin cancel a session
export const cancelAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.status = 'cancelled';
    announcement.cancelReason = req.body.reason ? req.body.reason.trim() : 'Session cancelled by coordinator';
    announcement.updatedBy = req.user._id;

    await announcement.save();

    // Notify members that session was cancelled
    broadcastPushNotification({
      title: '⚠️ Session Cancelled',
      body: `Today's session "${announcement.topic || 'Club Session'}" has been cancelled. Reason: ${announcement.cancelReason}`,
      data: { url: '/dashboard' },
    }).catch((err) => console.error('[Push] Cancel notification error:', err.message));

    res.json({
      message: 'Session announcement cancelled',
      announcement,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/announcements/:id/restore - Admin restore a cancelled session
export const restoreAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    announcement.status = 'scheduled';
    announcement.cancelReason = '';
    announcement.updatedBy = req.user._id;

    await announcement.save();

    res.json({
      message: 'Session announcement restored',
      announcement,
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

    // Send push notification for club broadcast
    broadcastPushNotification({
      title: `📢 Club Announcement: ${title.trim()}`,
      body: message.trim(),
      data: { url: '/dashboard' },
    }).catch((err) => console.error('[Push] Broadcast notification error:', err.message));

    res.status(201).json({
      message: 'Broadcast published successfully',
      broadcast,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/announcements/:id - Delete an announcement (Admin or creator staff)
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const isAdmin = req.user.role === 'admin';
    const isCreator = announcement.createdBy && announcement.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Forbidden: You can only delete announcements you created' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
