import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, default: null },
    contentJSON: { type: mongoose.Schema.Types.Mixed, required: true },
    category: { type: String, default: 'General' },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Template', templateSchema);
