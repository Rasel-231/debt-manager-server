import { z } from 'zod';

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
    name: z.string().min(1).max(100),
  }),
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(6).max(100).optional(),
  }),
});

export const userValidation = { createUserSchema, updateUserSchema };
