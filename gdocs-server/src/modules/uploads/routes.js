import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { getSignature } from './controller.js';

const router = Router();

router.use(requireAuth);
router.get('/signature', asyncHandler(getSignature));

export default router;
