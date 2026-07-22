import { getAuth } from '@clerk/express';
import * as commentsService from './service.js';

export async function list(req, res) {
  const comments = await commentsService.listComments(req.params.id);
  res.json(comments);
}

export async function create(req, res) {
  const { userId } = getAuth(req);
  const comment = await commentsService.createComment({
    documentId: req.params.id,
    authorId: userId,
    ...req.body,
  });
  res.status(201).json(comment);
}

export async function update(req, res) {
  const comment = await commentsService.updateComment(req.params.id, req.params.commentId, req.body);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.json(comment);
}

export async function remove(req, res) {
  const comment = await commentsService.deleteComment(req.params.id, req.params.commentId);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.status(204).send();
}
