import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'c3-platform',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }], // auto-resize, keeps files small
  },
});

// 8MB per file - generous for a photo upload, prevents someone from
// uploading something huge and tying up the request/Cloudinary bandwidth.
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

export default upload;
