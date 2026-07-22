import { Router } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import documentsRoutes from '../modules/documents/routes.js';
import uploadsRoutes from '../modules/uploads/routes.js';
import liveblocksRoutes from '../modules/liveblocks/routes.js';
import User from '../models/User.js';

const router = Router();

router.use('/documents', documentsRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/liveblocks-auth', liveblocksRoutes);

router.get('/health', (req, res) => res.json({ ok: true }));

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);
    res.json({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      avatarUrl: user.imageUrl,
    });
  })
);

router.get(
  '/users/search',
  requireAuth,
  asyncHandler(async (req, res) => {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped, 'i');

    // Not org-scoped yet — searches all synced users. Phase 6 (Clerk
    // Organizations) should narrow this to the requester's org members.
    const users = await User.find({
      $or: [{ name: pattern }, { email: pattern }],
    })
      .limit(10)
      .select('clerkId name email avatarUrl');

    res.json(users);
  })
);

export default router;
