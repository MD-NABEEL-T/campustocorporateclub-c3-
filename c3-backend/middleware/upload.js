import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// TEMP DIAGNOSTIC LOGGING - remove after debugging
console.log('[DIAG] Cloudinary config present:', {
  cloud_name: !!cloudinary.config().cloud_name,
  api_key: !!cloudinary.config().api_key,
  api_secret: !!cloudinary.config().api_secret,
});

const originalUploadStream = cloudinary.uploader.upload_stream.bind(cloudinary.uploader);
cloudinary.uploader.upload_stream = function (options, callback) {
  console.log('[DIAG 6-start] Cloudinary upload_stream started, folder:', options?.folder);
  return originalUploadStream(options, function (err, result) {
    if (err) {
      console.log('[DIAG 6-error] Cloudinary upload_stream errored:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    } else {
      console.log('[DIAG 6-done] Cloudinary upload_stream completed:', result?.public_id);
    }
    callback(err, result);
  });
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    console.log('[DIAG 4/5] Multer received file for field:', file.fieldname, '| originalname:', file.originalname);
    return {
      folder: 'c3-platform',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, crop: 'limit' }],
    };
  },
});

const upload = multer({ storage });

export default upload;