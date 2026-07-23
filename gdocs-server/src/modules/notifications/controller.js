import { getAuth } from '@clerk/express';
import * as notificationsService from './service.js';

export async function list(req, res) {
  const { userId } = getAuth(req);
  const notifications = await notificationsService.listNotifications(userId);
  res.json(notifications);
}

export async function markOneRead(req, res) {
  const { userId } = getAuth(req);
  const notification = await notificationsService.markRead(userId, req.params.id);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  res.json(notification);
}

export async function markAllRead(req, res) {
  const { userId } = getAuth(req);
  await notificationsService.markAllRead(userId);
  res.json({ ok: true });
}
