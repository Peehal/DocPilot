import { Liveblocks } from '@liveblocks/node';
import { getAuth, clerkClient } from '@clerk/express';
import { env } from '../../config/env.js';
import Document from '../../models/Document.js';

const liveblocks = new Liveblocks({ secret: env.liveblocksSecretKey });

export async function authorize(req, res) {
  const { userId, orgId } = getAuth(req);
  const { room } = req.body;

  if (!room) {
    return res.status(400).json({ error: 'room is required' });
  }

  const doc = await Document.findOne({ liveblocksRoomId: room });
  if (!doc) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const isOwner = doc.ownerId === userId;
  const isOrgMember = Boolean(doc.orgId) && doc.orgId === orgId;
  const isCollaborator = doc.collaborators.some((c) => c.userId === userId);

  if (!isOwner && !isOrgMember && !isCollaborator) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await clerkClient.users.getUser(userId);
  const name =
    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
    user.primaryEmailAddress?.emailAddress ||
    'Anonymous';

  const session = liveblocks.prepareSession(userId, {
    userInfo: { name, avatar: user.imageUrl },
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  res.status(status).send(body);
}
