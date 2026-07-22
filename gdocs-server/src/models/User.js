import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: String,
    name: String,
    avatarUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
