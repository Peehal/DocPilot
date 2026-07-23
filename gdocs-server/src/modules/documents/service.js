import Document from '../../models/Document.js';
import Template from '../../models/Template.js';

export function listDocuments({ userId, orgId }) {
  const query = orgId
    ? { orgId }
    : { orgId: null, $or: [{ ownerId: userId }, { 'collaborators.userId': userId }] };
  return Document.find(query).sort({ updatedAt: -1 });
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
  return Document.findByIdAndDelete(id);
}
