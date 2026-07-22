import { getAuth } from '@clerk/express';
import * as documentsService from './service.js';

export async function list(req, res) {
  const { userId, orgId } = getAuth(req);
  const docs = await documentsService.listDocuments({ userId, orgId });
  res.json(docs);
}

export async function create(req, res) {
  const { userId, orgId } = getAuth(req);
  const doc = await documentsService.createDocument({
    userId,
    orgId,
    title: req.body.title,
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
