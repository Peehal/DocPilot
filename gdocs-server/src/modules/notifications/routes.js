import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as notificationsController from './controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(notificationsController.list));
router.patch('/read-all', asyncHandler(notificationsController.markAllRead));
router.patch('/:id/read', asyncHandler(notificationsController.markOneRead));

export default router;
