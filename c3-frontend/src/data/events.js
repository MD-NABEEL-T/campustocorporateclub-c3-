// Mock data only. Each event mirrors the shape the future API response is
// expected to use, so swapping this file for a fetch() call (or removing it
// in favor of an API hook) won't require touching the components that
// consume it - they only ever read these field names off each object.
//
// coverImage / gallery are placeholder Unsplash URLs until Cloudinary is
// wired up (explicitly out of scope for now).

export const EVENTS = [
  {
    title: 'Hackathon & Debate',
    slug: 'hackathon',
    category: 'Hackathon',
    date: '2025',
    participantCount: 120,
    description: 'A 24-hour build sprint paired with a live technical debate round.',
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'
    ]
  },
  {
    title: 'GitHub & LinkedIn Workshop',
    slug: 'github-linkedin',
    category: 'Workshop',
    date: '2025',
    participantCount: 85,
    description: 'Hands-on session on building a portfolio that actually gets noticed.',
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
    ]
  },
  {
    title: 'Domains Session',
    slug: 'domains',
    category: 'Session',
    date: '2024',
    participantCount: 60,
    description: 'Every core domain, explained by the members who actually work in it.',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
    ]
  },
  {
    title: 'Sprintathon',
    slug: 'sprintathon',
    category: 'Sprint',
    date: '2024',
    participantCount: 150,
    description: 'Short sprints, real deadlines - a week of shipping in public.',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'
    ]
  }
];

// Mixed gallery pool for the masonry section below the carousel - pulled
// from all events rather than any single one.
export const EVENT_GALLERY = EVENTS.flatMap((event, eventIndex) =>
  event.gallery.map((img, i) => ({
    id: `${event.slug}-${i}`,
    img,
    // Masonry's built-in click handler opens `url` in a new tab - pointing
    // it at the image itself is a harmless placeholder until a real
    // lightbox or event page is wired up (explicitly out of scope for now).
    url: img,
    // height varies per item so the masonry columns don't line up into a grid
    height: 280 + ((eventIndex * 2 + i) % 3) * 90
  }))
);

export const EVENT_STATS = [
  { to: 15, suffix: '+', label: 'Events' },
  { to: 500, suffix: '+', label: 'Participants' },
  { to: 30, suffix: '+', label: 'Sessions' },
  { to: 10, suffix: '+', label: 'Workshops' }
];