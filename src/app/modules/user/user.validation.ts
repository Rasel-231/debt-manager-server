import { z } from 'zod';

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
    isActive: z.boolean().optional(),
    password: z.string().min(6).max(100).optional(),
  }),
});

export const userValidation = { updateUserSchema };
