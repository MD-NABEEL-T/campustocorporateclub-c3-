import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Resumes need different constraints than event/session images (raw docs, not
// image transforms), so this stays separate from middleware/upload.js rather
// than modifying the existing image-upload config used elsewhere.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'c3-applications',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'],
  },
});

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const resumeUpload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB cap
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File must be an image (JPG/PNG/WEBP) or PDF/Word document'));
    }
  },
});

export default resumeUpload;