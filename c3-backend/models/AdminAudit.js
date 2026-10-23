import mongoose from 'mongoose';

const adminAuditSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['grant_admin', 'revoke_admin', 'grant_coordinator', 'revoke_coordinator'],
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetName: {
      type: String,
      required: true,
    },
    targetEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AdminAudit', adminAuditSchema);
