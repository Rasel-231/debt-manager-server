import { z } from 'zod';

const createTransactionSchema = z.object({
  body: z.object({
    loanId: z.string().uuid('A valid loan id is required'),
    amountPaid: z.number().positive('Amount must be greater than zero'),
    type: z.enum(['DEPOSIT', 'PAYMENT']),
    paymentDate: z.string().datetime({ offset: true }).optional().nullable(),
    notes: z.string().max(500).optional().nullable(),
  }),
});

const updateTransactionSchema = z.object({
  body: z.object({
    amountPaid: z.number().positive('Amount must be greater than zero').optional(),
    type: z.enum(['DEPOSIT', 'PAYMENT']).optional(),
    paymentDate: z.string().datetime({ offset: true }).optional().nullable(),
    notes: z.string().max(500).optional().nullable(),
  }),
});

export const transactionValidation = { createTransactionSchema, updateTransactionSchema };
