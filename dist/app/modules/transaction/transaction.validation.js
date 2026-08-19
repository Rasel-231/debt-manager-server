"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionValidation = void 0;
const zod_1 = require("zod");
const createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        loanId: zod_1.z.string().uuid('A valid loan id is required'),
        amountPaid: zod_1.z.number().positive('Amount must be greater than zero'),
        type: zod_1.z.enum(['DEPOSIT', 'PAYMENT']),
        paymentDate: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
        notes: zod_1.z.string().max(500).optional().nullable(),
    }),
});
const updateTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        amountPaid: zod_1.z.number().positive('Amount must be greater than zero').optional(),
        type: zod_1.z.enum(['DEPOSIT', 'PAYMENT']).optional(),
        paymentDate: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
        notes: zod_1.z.string().max(500).optional().nullable(),
    }),
});
exports.transactionValidation = { createTransactionSchema, updateTransactionSchema };
//# sourceMappingURL=transaction.validation.js.map