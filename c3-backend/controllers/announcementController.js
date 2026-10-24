import Announcement from '../models/Announcement.js';
import {
  getSessionAnnouncements,
  getKolkataDayBounds,
  parseSessionStorageDate,
  generateDisplayTime,
} from '../utils/dateUtils.js';
import { notifyAllApproved } from '../utils/notify.js';
import { computeSessionReminderTimes } from '../services/reminderScheduler.js';

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
      reminderSentAt: null, // Fresh session starts with unconsumed reminder
    });

    // Notify all approved members via central notifier (in-app + web push)
    notifyAllApproved(
      {
        type: 'session',
        title: `📢 New Session: ${topic.trim()}`,
        body: `${displayTime ? displayTime + ' • ' : ''}${venue ? 'Venue: ' + venue.trim() + ' • ' : ''}Handled by ${handledBy.trim()}`,
        link: '/dashboard',
        refId: String(sessionAnnouncement._id),
        tag: `session-${sessionAnnouncement._id}`,
      },
      { excludeUserId: req.user._id }
    ).catch((err) => console.error('[Notify] Failed to broadcast session notification:', err.message));

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
    const changes = [];

    // Track venue change
    if (venue !== undefined) {
      const trimmedVenue = venue.trim();
      if (trimmedVenue !== (announcement.venue || '')) {
        changes.push(trimmedVenue ? `Venue changed to ${trimmedVenue}` : 'Venue cleared');
        announcement.venue = trimmedVenue;
      }
    }

    // Track time change
    let timingUpdated = false;
    if (startTime !== undefined) {
      const trimmedStart = startTime.trim();
      if (trimmedStart !== (announcement.startTime || '')) {
        announcement.startTime = trimmedStart;
        timingUpdated = true;
      }
    }
    if (endTime !== undefined) {
      const trimmedEnd = endTime.trim();
      if (trimmedEnd !== (announcement.endTime || '')) {
        announcement.endTime = trimmedEnd;
        timingUpdated = true;
      }
    }

    if (timingUpdated || time !== undefined) {
      const newDisplayTime = generateDisplayTime(
        time !== undefined ? time : announcement.time,
        announcement.startTime,
        announcement.endTime
      );
      if (newDisplayTime !== announcement.time) {
        changes.push(`Time changed to ${newDisplayTime}`);
        announcement.time = newDisplayTime;
      }
    }

    // Track message change
    if (message !== undefined) {
      const trimmedMsg = message.trim();
      if (trimmedMsg !== (announcement.message || '')) {
        changes.push('Session agenda updated');
        announcement.message = trimmedMsg;
      }
    }

    announcement.editedAt = new Date();
    announcement.updatedBy = req.user._id;

    // If startTime or date changed and the new reminder time is still in future, clear reminderSentAt
    if (timingUpdated && announcement.reminderSentAt) {
      const { reminderTime } = computeSessionReminderTimes(announcement.date, announcement.startTime);
      if (reminderTime > new Date()) {
        announcement.reminderSentAt = null;
      }
    }

    await announcement.save();

    // Only notify if something actually changed
    if (changes.length > 0) {
      notifyAllApproved(
        {
          type: 'quick_edit',
          title: `Update: ${announcement.topic}`,
          body: changes.join(' • '),
          link: '/dashboard',
          refId: String(announcement._id),
          tag: `session-${announcement._id}`,
        },
        {
          excludeUserId: req.user._id,
          collapseWindowMs: 120000, // 2 minutes collapse window
        }
      ).catch((err) => console.error('[Notify] Quick edit notification error:', err.message));
    }

    res.json({
      message: 'Announcement updated successfully',
      announcement,
      changes,
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
    notifyAllApproved(
      {
        type: 'cancellation',
        title: '⚠️ Session Cancelled',
        body: `Today's session "${announcement.topic || 'Club Session'}" has been cancelled. Reason: ${announcement.cancelReason}`,
        link: '/dashboard',
        refId: String(announcement._id),
        tag: `session-${announcement._id}`,
      },
      { excludeUserId: req.user._id }
    ).catch((err) => console.error('[Notify] Cancel notification error:', err.message));

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

    // If new reminder time is still in future, clear reminderSentAt
    const { reminderTime } = computeSessionReminderTimes(announcement.date, announcement.startTime);
    if (reminderTime > new Date()) {
      announcement.reminderSentAt = null;
    }

    await announcement.save();

    // Notify members that session is back on
    notifyAllApproved(
      {
        type: 'restore',
        title: 'Session is back on',
        body: `Today's session "${announcement.topic || 'Club Session'}" is back on (${announcement.time || 'scheduled'})!`,
        link: '/dashboard',
        refId: String(announcement._id),
        tag: `session-${announcement._id}`,
      },
      { excludeUserId: req.user._id }
    ).catch((err) => console.error('[Notify] Restore notification error:', err.message));

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

    // Send notification for club broadcast
    notifyAllApproved(
      {
        type: 'broadcast',
        title: `📢 Club Announcement: ${title.trim()}`,
        body: message.trim(),
        link: '/dashboard',
        refId: String(broadcast._id),
        tag: `broadcast-${broadcast._id}`,
      },
      { excludeUserId: req.user._id }
    ).catch((err) => console.error('[Notify] Broadcast notification error:', err.message));

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
