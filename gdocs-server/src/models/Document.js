import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled document' },
    ownerId: { type: String, required: true, index: true },
    orgId: { type: String, default: null, index: true },
    contentJSON: { type: mongoose.Schema.Types.Mixed, default: null },
    liveblocksRoomId: { type: String },
    margins: {
      top: { type: Number, default: 96 },
      bottom: { type: Number, default: 96 },
      left: { type: Number, default: 96 },
      right: { type: Number, default: 96 },
    },
    collaborators: [
      {
        userId: String,
        role: { type: String, enum: ['viewer', 'editor'], default: 'editor' },
      },
    ],
    isTemplate: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

documentSchema.pre('save', function setRoomId(next) {
  if (!this.liveblocksRoomId) {
    this.liveblocksRoomId = `doc-${this._id}`;
  }
  next();
});

export default mongoose.model('Document', documentSchema);
