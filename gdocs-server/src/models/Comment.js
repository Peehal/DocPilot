import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true, index: true },
    authorId: { type: String, required: true },
    body: { type: String, required: true },
    anchorId: { type: String, default: null },
    mentions: [{ type: String }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null, index: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
