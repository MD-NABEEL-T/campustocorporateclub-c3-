import Event from '../models/Event.js';

// Create an event - admin only
export const createEvent = async (req, res) => {
  console.log('[DIAG 7] createEvent started'); // TEMP DIAGNOSTIC LOGGING - remove after debugging
  try {
    const { title, description, date, summary, attendeeCount, highlights, category, slug } = req.body;

    if (!req.files || !req.files.coverImage) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    const coverImage = req.files.coverImage[0].path; // Cloudinary URL
    const gallery = req.files.gallery ? req.files.gallery.map(f => f.path) : [];

    const event = await Event.create({
      title,
      slug,
      category,
      description,
      date,
      coverImage,
      gallery,
      summary,
      attendeeCount,
      highlights,
      createdBy: req.user._id,
    });

    console.log('[DIAG 8] createEvent completed, event id:', event._id.toString()); // TEMP DIAGNOSTIC LOGGING - remove after debugging
    res.status(201).json(event);
  } catch (err) {
    console.error('[DIAG 8-error] createEvent threw:', JSON.stringify(err, Object.getOwnPropertyNames(err))); // TEMP DIAGNOSTIC LOGGING - remove after debugging
    res.status(500).json({ message: err.message });
  }
};

// Get all events - any logged in user
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit event (including adding the report later) - admin only
export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, summary, attendeeCount, highlights, category, slug } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.title = title ?? event.title;
    event.slug = slug ?? event.slug;
    event.category = category ?? event.category;
    event.description = description ?? event.description;
    event.date = date ?? event.date;
    event.summary = summary ?? event.summary;
    event.attendeeCount = attendeeCount ?? event.attendeeCount;
    event.highlights = highlights ?? event.highlights;

    if (req.files && req.files.coverImage) {
      event.coverImage = req.files.coverImage[0].path;
    }
    // Uploading gallery files on update replaces the existing gallery.
    // (Adding/removing individual images can be a separate endpoint later.)
    if (req.files && req.files.gallery) {
      event.gallery = req.files.gallery.map(f => f.path);
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};