import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { exportDocument } from './controller.js';

const router = Router({ mergeParams: true });

router.get('/', asyncHandler(exportDocument));

export default router;
