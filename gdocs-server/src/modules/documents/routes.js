import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireDocAccess } from '../../middleware/requireDocAccess.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createDocumentSchema, renameDocumentSchema } from './schema.js';
import * as documentsController from './controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(documentsController.list));
router.post('/', validate(createDocumentSchema), asyncHandler(documentsController.create));
router.get('/:id', requireDocAccess, asyncHandler(documentsController.getOne));
router.patch(
  '/:id',
  requireDocAccess,
  validate(renameDocumentSchema),
  asyncHandler(documentsController.rename)
);
router.delete('/:id', requireDocAccess, asyncHandler(documentsController.remove));

export default router;
