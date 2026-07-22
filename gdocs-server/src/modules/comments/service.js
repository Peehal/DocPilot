import Comment from '../../models/Comment.js';
import User from '../../models/User.js';

// authorId is a raw Clerk id string (not a Mongo ref), so a normal populate()
// won't work — join it to User manually to attach display name/avatar.
export async function listComments(documentId) {
  const comments = await Comment.find({ documentId }).sort({ createdAt: 1 }).lean();

  const authorIds = [...new Set(comments.map((c) => c.authorId))];
  const users = await User.find({ clerkId: { $in: authorIds } }).select(
    'clerkId name email avatarUrl'
  );
  const userMap = new Map(users.map((u) => [u.clerkId, u]));

  return comments.map((c) => ({
    ...c,
    author: userMap.get(c.authorId) || { clerkId: c.authorId, name: 'Unknown user' },
  }));
}

export function createComment({ documentId, authorId, body, anchorId, mentions, parentId }) {
  return Comment.create({
    documentId,
    authorId,
    body,
    anchorId: anchorId || null,
    mentions: mentions || [],
    parentId: parentId || null,
  });
}

export function updateComment(documentId, commentId, updates) {
  return Comment.findOneAndUpdate({ _id: commentId, documentId }, updates, { new: true });
}

export function deleteComment(documentId, commentId) {
  return Comment.findOneAndDelete({ _id: commentId, documentId });
}
