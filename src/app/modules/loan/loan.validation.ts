import { z } from 'zod';

const createLoanSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(150),
    amount: z.number().positive('Amount must be greater than zero'),
    loanType: z.enum(['CASH_WITH_PRODUCT', 'CASH_ONLY']),
    dueDate: z.string().datetime({ offset: true }).optional().nullable(),
  }),
});

const updateLoanSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).max(150).optional(),
      amount: z.number().positive('Amount must be greater than zero').optional(),
      remainingAmount: z.number().nonnegative('Remaining amount cannot be negative').optional(),
      loanType: z.enum(['CASH_WITH_PRODUCT', 'CASH_ONLY']).optional(),
      status: z.enum(['PENDING', 'ACTIVE', 'FINISHED', 'DUE']).optional(),
      dueDate: z.string().datetime({ offset: true }).optional().nullable(),
    })
    .refine(
      (data) =>
        data.amount === undefined ||
        data.remainingAmount === undefined ||
        data.remainingAmount <= data.amount,
      { message: 'Remaining amount cannot exceed total amount' }
    ),
});

export const loanValidation = { createLoanSchema, updateLoanSchema };
