import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.string().min(1).max(2000),
  anchorId: z.string().nullable().optional(),
  mentions: z.array(z.string()).optional(),
  parentId: z.string().nullable().optional(),
});

export const updateCommentSchema = z
  .object({
    body: z.string().min(1).max(2000),
    resolved: z.boolean(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field (body, resolved) is required',
  });
