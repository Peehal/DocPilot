import { getAuth } from '@clerk/express';
import Document from '../models/Document.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireDocAccess = asyncHandler(async (req, res, next) => {
  const { userId, orgId } = getAuth(req);
  const doc = await Document.findById(req.params.id);

  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const isOwner = doc.ownerId === userId;
  const isOrgMember = Boolean(doc.orgId) && doc.orgId === orgId;
  const isCollaborator = doc.collaborators.some((c) => c.userId === userId);

  if (!isOwner && !isOrgMember && !isCollaborator) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.document = doc;
  next();
});
