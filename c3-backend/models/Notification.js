import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'session',
        'cancellation',
        'broadcast',
        'role_change',
        'quick_edit',
        'restore',
        'registration',
        'reminder',
        'system',
      ],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: '/dashboard',
    },
    refId: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: '',
    },
    readAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 24 * 60 * 60, // 60-day MongoDB TTL
    },
  },
  { timestamps: false }
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, readAt: 1 });

export default mongoose.model('Notification', notificationSchema);
