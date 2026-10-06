import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['today_session', 'broadcast'],
      default: 'broadcast',
      required: true,
    },
    title: { type: String, required: true },
    topic: { type: String }, // For today's session
    handledBy: { type: String }, // For today's session
    time: { type: String }, // e.g. "4:30 PM - 5:00 PM"
    venue: { type: String }, // e.g. "CSE Seminar Hall"
    message: { type: String }, // For broadcasts or session agenda
    isActive: { type: Boolean, default: true },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', announcementSchema);
