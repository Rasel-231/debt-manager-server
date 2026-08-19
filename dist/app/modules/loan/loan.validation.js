"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanValidation = void 0;
const zod_1 = require("zod");
const createLoanSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, 'Title is required').max(150),
        amount: zod_1.z.number().positive('Amount must be greater than zero'),
        loanType: zod_1.z.enum(['CASH_WITH_PRODUCT', 'CASH_ONLY']),
        dueDate: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
    }),
});
const updateLoanSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1).max(150).optional(),
        amount: zod_1.z.number().positive('Amount must be greater than zero').optional(),
        remainingAmount: zod_1.z.number().nonnegative('Remaining amount cannot be negative').optional(),
        loanType: zod_1.z.enum(['CASH_WITH_PRODUCT', 'CASH_ONLY']).optional(),
        status: zod_1.z.enum(['PENDING', 'ACTIVE', 'FINISHED', 'DUE']).optional(),
        dueDate: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
    })
        .refine((data) => data.amount === undefined ||
        data.remainingAmount === undefined ||
        data.remainingAmount <= data.amount, { message: 'Remaining amount cannot exceed total amount' }),
});
exports.loanValidation = { createLoanSchema, updateLoanSchema };
//# sourceMappingURL=loan.validation.js.map