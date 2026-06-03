import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customAlias: {
      type: String,
      trim: true,
      default: null,
    },
    qrCode: {
      type: String,
      default: null,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

shortUrlSchema.index({ userId: 1, createdAt: -1 });

const ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);
export default ShortUrl;
