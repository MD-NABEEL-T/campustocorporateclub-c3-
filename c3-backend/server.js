import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { initWebPush } from './utils/pushNotificationService.js';
import { initReminderScheduler } from './services/reminderScheduler.js';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();
connectDB();
initWebPush();
initReminderScheduler();

const app = express();


const getAllowedOrigins = () => {
  const rawClientUrl = process.env.CLIENT_URL || '';
  const origins = rawClientUrl
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);

  if (process.env.NODE_ENV !== 'production') {
    if (!origins.includes('http://localhost:5173')) {
      origins.push('http://localhost:5173');
    }
  }
  return origins;
};

const corsOptions = {
  origin: (origin, callback) => {
    // Requests with no origin (curl, Postman, etc.) stay allowed
    if (!origin) return callback(null, true);

    const allowedOrigins = getAllowedOrigins();
    const normalizedOrigin = origin.trim().replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/notifications', notificationRoutes);

// --- EVENT MODULE ---
import * as eventConfig from './event-module/config.js';
import eventModuleRoutes from './event-module/routes.js';
if (eventConfig.EVENT_ENABLED) {
    app.use('/api/event', eventModuleRoutes);
}
// --------------------

// Global error handler
app.use((err, req, res, next) => {
  if (err && err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ message: err.message });
  }
  return res.status(500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.OWNER_EMAIL || !process.env.OWNER_EMAIL.trim()) {
    console.warn('[WARNING] OWNER_EMAIL is not set. Owner-only admin promotion/revocation endpoints are disabled.');
  }
});