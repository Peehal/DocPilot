import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  orgId: z.string().nullable().optional(),
  templateId: z.string().optional(),
});

const marginsSchema = z.object({
  top: z.number().min(0).max(300),
  bottom: z.number().min(0).max(300),
  left: z.number().min(0).max(300),
  right: z.number().min(0).max(300),
});

export const updateDocumentSchema = z
  .object({
    title: z.string().min(1).max(200),
    contentJSON: z.any(),
    margins: marginsSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field (title, contentJSON, margins) is required',
  });
