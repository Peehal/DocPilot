import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  orgId: z.string().nullable().optional(),
});

export const renameDocumentSchema = z.object({
  title: z.string().min(1).max(200),
});
