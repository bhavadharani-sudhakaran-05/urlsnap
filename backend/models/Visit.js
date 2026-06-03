import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    shortUrlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShortUrl',
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
      default: 'unknown',
    },
    device: {
      type: String,
      default: 'unknown',
    },
    browser: {
      type: String,
      default: 'unknown',
    },
    country: {
      type: String,
      default: 'unknown',
    },
    city: {
      type: String,
      default: 'unknown',
    },
  },
  {
    timestamps: false,
  }
);

visitSchema.index({ shortUrlId: 1, timestamp: -1 });

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
