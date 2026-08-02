import Event from '../models/Event.js';

// GET /api/public/events - no auth required, used by the public landing page.
// Returns only the fields the landing page actually needs (no createdBy, etc).
export const getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .select('title slug category description date coverImage gallery attendeeCount');

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};