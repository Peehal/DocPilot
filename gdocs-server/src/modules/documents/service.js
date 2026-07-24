import Document from '../../models/Document.js';
import Template from '../../models/Template.js';

export function listDocuments({ userId, orgId }) {
  const query = orgId
    ? { orgId, deletedAt: null }
    : {
        orgId: null,
        deletedAt: null,
        $or: [{ ownerId: userId }, { 'collaborators.userId': userId }],
      };
  return Document.find(query).sort({ updatedAt: -1 });
}

export function listSharedDocuments({ userId }) {
  return Document.find({
    deletedAt: null,
    ownerId: { $ne: userId },
    'collaborators.userId': userId,
  }).sort({ updatedAt: -1 });
}

export function listTrash({ userId }) {
  return Document.find({ ownerId: userId, deletedAt: { $ne: null } }).sort({ deletedAt: -1 });
}

export async function createDocument({ userId, orgId, title, templateId }) {
  let contentJSON = null;
  let resolvedTitle = title;

  if (templateId) {
    const template = await Template.findById(templateId);
    if (template) {
      contentJSON = template.contentJSON;
      resolvedTitle = resolvedTitle || template.name;
    }
  }

  return Document.create({
    ownerId: userId,
    orgId: orgId || null,
    title: resolvedTitle || 'Untitled document',
    contentJSON,
  });
}

export function updateDocument(id, updates) {
  return Document.findByIdAndUpdate(id, updates, { new: true });
}

export function deleteDocument(id) {
  return Document.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
}

export function restoreDocument(id) {
  return Document.findByIdAndUpdate(id, { deletedAt: null }, { new: true });
}

export function permanentlyDeleteDocument(id) {
  return Document.findByIdAndDelete(id);
}
