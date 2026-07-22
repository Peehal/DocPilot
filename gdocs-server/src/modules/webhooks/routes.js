import { Router } from 'express';
import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { handleClerkWebhook } from './controller.js';

const router = Router();

router.post('/clerk', express.raw({ type: 'application/json' }), asyncHandler(handleClerkWebhook));

export default router;
