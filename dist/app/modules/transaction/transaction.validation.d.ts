import { z } from 'zod';
export declare const transactionValidation: {
    createTransactionSchema: z.ZodObject<{
        body: z.ZodObject<{
            loanId: z.ZodString;
            amountPaid: z.ZodNumber;
            type: z.ZodEnum<["DEPOSIT", "PAYMENT"]>;
            paymentDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            type: "DEPOSIT" | "PAYMENT";
            amountPaid: number;
            loanId: string;
            paymentDate?: string | null | undefined;
            notes?: string | null | undefined;
        }, {
            type: "DEPOSIT" | "PAYMENT";
            amountPaid: number;
            loanId: string;
            paymentDate?: string | null | undefined;
            notes?: string | null | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            type: "DEPOSIT" | "PAYMENT";
            amountPaid: number;
            loanId: string;
            paymentDate?: string | null | undefined;
            notes?: string | null | undefined;
        };
    }, {
        body: {
            type: "DEPOSIT" | "PAYMENT";
            amountPaid: number;
            loanId: string;
            paymentDate?: string | null | undefined;
            notes?: string | null | undefined;
        };
    }>;
    updateTransactionSchema: z.ZodObject<{
        body: z.ZodObject<{
            amountPaid: z.ZodOptional<z.ZodNumber>;
            type: z.ZodOptional<z.ZodEnum<["DEPOSIT", "PAYMENT"]>>;
            paymentDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            type?: "DEPOSIT" | "PAYMENT" | undefined;
            amountPaid?: number | undefined;
            paymentDate?: string | null | undefined;
            notes?: string | null | undefined;
        }, {
            type?: "DEPOSIT" | "PAYMENT" | undefined;
            amountPaid?: number | undefined;
            paymentDate?: string | null | undefined;
            notes?: string | null | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            type?: "DEPOSIT" | "PAYMENT" | undefined;
            amountPaid?: number | undefined;
            paymentDate?: string | null | undefined;
            notes?: string | null | undefined;
        };
    }, {
        body: {
            type?: "DEPOSIT" | "PAYMENT" | undefined;
            amountPaid?: number | undefined;
            paymentDate?: string | null | undefined;
            notes?: string | null | undefined;
        };
    }>;
};
//# sourceMappingURL=transaction.validation.d.ts.map