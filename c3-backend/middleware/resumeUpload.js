import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Resumes need different constraints than event/session images (raw docs, not
// image transforms), so this stays separate from middleware/upload.js rather
// than modifying the existing image-upload config used elsewhere.
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'c3-applications/resumes',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
  },
});

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const resumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Resume must be a PDF or Word document'));
    }
  },
});

export default resumeUpload;