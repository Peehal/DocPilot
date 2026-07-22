import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createCommentSchema, updateCommentSchema } from './schema.js';
import * as commentsController from './controller.js';

const router = Router({ mergeParams: true });

router.get('/', asyncHandler(commentsController.list));
router.post('/', validate(createCommentSchema), asyncHandler(commentsController.create));
router.patch(
  '/:commentId',
  validate(updateCommentSchema),
  asyncHandler(commentsController.update)
);
router.delete('/:commentId', asyncHandler(commentsController.remove));

export default router;
