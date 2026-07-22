import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authorize } from './controller.js';

const router = Router();

router.post('/', requireAuth, asyncHandler(authorize));

export default router;
