import Notification from '../../models/Notification.js';
import User from '../../models/User.js';
import Document from '../../models/Document.js';

export function createNotification({ userId, type, actorId, documentId }) {
  if (userId === actorId) return null; // never notify yourself
  return Notification.create({ userId, type, actorId, documentId });
}

// actorId/documentId are raw ids (Clerk string / Mongo ref), so join in the
// display info (actor name, document title) manually, same pattern as comments.
export async function listNotifications(userId) {
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const actorIds = [...new Set(notifications.map((n) => n.actorId))];
  const documentIds = [...new Set(notifications.map((n) => String(n.documentId)))];

  const [actors, docs] = await Promise.all([
    User.find({ clerkId: { $in: actorIds } }).select('clerkId name avatarUrl'),
    Document.find({ _id: { $in: documentIds } }).select('title'),
  ]);

  const actorMap = new Map(actors.map((a) => [a.clerkId, a]));
  const docMap = new Map(docs.map((d) => [String(d._id), d]));

  return notifications.map((n) => ({
    ...n,
    actor: actorMap.get(n.actorId) || { clerkId: n.actorId, name: 'Someone' },
    document: docMap.get(String(n.documentId)) || null,
  }));
}

export function markRead(userId, id) {
  return Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
}

export function markAllRead(userId) {
  return Notification.updateMany({ userId, read: false }, { read: true });
}
