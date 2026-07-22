import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireDocAccess } from '../../middleware/requireDocAccess.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createDocumentSchema, updateDocumentSchema } from './schema.js';
import * as documentsController from './controller.js';
import commentsRoutes from '../comments/routes.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(documentsController.list));
router.post('/', validate(createDocumentSchema), asyncHandler(documentsController.create));
router.get('/:id', requireDocAccess, asyncHandler(documentsController.getOne));
router.patch(
  '/:id',
  requireDocAccess,
  validate(updateDocumentSchema),
  asyncHandler(documentsController.update)
);
router.delete('/:id', requireDocAccess, asyncHandler(documentsController.remove));

router.use('/:id/comments', requireDocAccess, commentsRoutes);

export default router;
