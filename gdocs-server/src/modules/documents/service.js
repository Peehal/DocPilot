import Document from '../../models/Document.js';

export function listDocuments({ userId, orgId }) {
  const query = orgId
    ? { orgId }
    : { orgId: null, $or: [{ ownerId: userId }, { 'collaborators.userId': userId }] };
  return Document.find(query).sort({ updatedAt: -1 });
}

export function createDocument({ userId, orgId, title }) {
  return Document.create({
    ownerId: userId,
    orgId: orgId || null,
    title: title || 'Untitled document',
  });
}

export function renameDocument(id, title) {
  return Document.findByIdAndUpdate(id, { title }, { new: true });
}

export function deleteDocument(id) {
  return Document.findByIdAndDelete(id);
}
