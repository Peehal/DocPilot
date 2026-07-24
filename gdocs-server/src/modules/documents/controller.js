import { getAuth } from '@clerk/express';
import * as documentsService from './service.js';

export async function list(req, res) {
  const { userId, orgId } = getAuth(req);
  const scope = req.query.scope || 'mine';

  if (scope === 'shared') {
    return res.json(await documentsService.listSharedDocuments({ userId }));
  }
  if (scope === 'trash') {
    return res.json(await documentsService.listTrash({ userId }));
  }

  res.json(await documentsService.listDocuments({ userId, orgId }));
}

export async function create(req, res) {
  const { userId, orgId } = getAuth(req);
  const doc = await documentsService.createDocument({
    userId,
    orgId,
    title: req.body.title,
    templateId: req.body.templateId,
  });
  res.status(201).json(doc);
}

export async function getOne(req, res) {
  res.json(req.document);
}

export async function update(req, res) {
  const doc = await documentsService.updateDocument(req.params.id, req.body);
  res.json(doc);
}

export async function remove(req, res) {
  await documentsService.deleteDocument(req.params.id);
  res.status(204).send();
}

export async function restore(req, res) {
  const { userId } = getAuth(req);
  if (req.document.ownerId !== userId) {
    return res.status(403).json({ error: 'Only the owner can restore this document' });
  }
  const doc = await documentsService.restoreDocument(req.params.id);
  res.json(doc);
}

export async function permanentRemove(req, res) {
  const { userId } = getAuth(req);
  if (req.document.ownerId !== userId) {
    return res.status(403).json({ error: 'Only the owner can permanently delete this document' });
  }
  await documentsService.permanentlyDeleteDocument(req.params.id);
  res.status(204).send();
}
