import Comment from '../../models/Comment.js';
import User from '../../models/User.js';
import Document from '../../models/Document.js';
import * as notificationsService from '../notifications/service.js';

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

export async function createComment({ documentId, authorId, body, anchorId, mentions, parentId }) {
  const comment = await Comment.create({
    documentId,
    authorId,
    body,
    anchorId: anchorId || null,
    mentions: mentions || [],
    parentId: parentId || null,
  });

  await notifyForComment({ comment, documentId, authorId });

  return comment;
}

// Notify: the document owner, the parent comment's author (on a reply), and
// anyone @mentioned — mentions win over a plain "comment" notification if a
// recipient qualifies for both. Never notifies the commenter about themself.
async function notifyForComment({ comment, documentId, authorId }) {
  const recipientTypes = new Map();

  const doc = await Document.findById(documentId).select('ownerId');
  if (doc && doc.ownerId !== authorId) {
    recipientTypes.set(doc.ownerId, 'comment');
  }

  if (comment.parentId) {
    const parent = await Comment.findById(comment.parentId).select('authorId');
    if (parent && parent.authorId !== authorId) {
      recipientTypes.set(parent.authorId, 'comment');
    }
  }

  for (const mentionId of comment.mentions || []) {
    if (mentionId !== authorId) {
      recipientTypes.set(mentionId, 'mention');
    }
  }

  await Promise.all(
    [...recipientTypes.entries()].map(([userId, type]) =>
      notificationsService.createNotification({ userId, type, actorId: authorId, documentId })
    )
  );
}

export function updateComment(documentId, commentId, updates) {
  return Comment.findOneAndUpdate({ _id: commentId, documentId }, updates, { new: true });
}

export function deleteComment(documentId, commentId) {
  return Comment.findOneAndDelete({ _id: commentId, documentId });
}
