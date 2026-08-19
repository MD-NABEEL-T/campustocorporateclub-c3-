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

// GET /api/public/events/:slug - no auth required, used by the public
// Event Details page (/events/:slug). Looks up by slug (not _id) since
// that's what the public URL uses, and - like getPublicEvents above -
// leaves out admin-only fields such as createdBy.
export const getPublicEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug })
      .select('title slug category description summary date coverImage gallery attendeeCount');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};