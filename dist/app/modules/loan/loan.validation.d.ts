import { z } from 'zod';
export declare const loanValidation: {
    createLoanSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            amount: z.ZodNumber;
            loanType: z.ZodEnum<["CASH_WITH_PRODUCT", "CASH_ONLY"]>;
            dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            title: string;
            amount: number;
            loanType: "CASH_WITH_PRODUCT" | "CASH_ONLY";
            dueDate?: string | null | undefined;
        }, {
            title: string;
            amount: number;
            loanType: "CASH_WITH_PRODUCT" | "CASH_ONLY";
            dueDate?: string | null | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            title: string;
            amount: number;
            loanType: "CASH_WITH_PRODUCT" | "CASH_ONLY";
            dueDate?: string | null | undefined;
        };
    }, {
        body: {
            title: string;
            amount: number;
            loanType: "CASH_WITH_PRODUCT" | "CASH_ONLY";
            dueDate?: string | null | undefined;
        };
    }>;
    updateLoanSchema: z.ZodObject<{
        body: z.ZodEffects<z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            amount: z.ZodOptional<z.ZodNumber>;
            remainingAmount: z.ZodOptional<z.ZodNumber>;
            loanType: z.ZodOptional<z.ZodEnum<["CASH_WITH_PRODUCT", "CASH_ONLY"]>>;
            status: z.ZodOptional<z.ZodEnum<["PENDING", "ACTIVE", "FINISHED", "DUE"]>>;
            dueDate: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            status?: "PENDING" | "ACTIVE" | "FINISHED" | "DUE" | undefined;
            title?: string | undefined;
            amount?: number | undefined;
            remainingAmount?: number | undefined;
            loanType?: "CASH_WITH_PRODUCT" | "CASH_ONLY" | undefined;
            dueDate?: string | null | undefined;
        }, {
            status?: "PENDING" | "ACTIVE" | "FINISHED" | "DUE" | undefined;
            title?: string | undefined;
            amount?: number | undefined;
            remainingAmount?: number | undefined;
            loanType?: "CASH_WITH_PRODUCT" | "CASH_ONLY" | undefined;
            dueDate?: string | null | undefined;
        }>, {
            status?: "PENDING" | "ACTIVE" | "FINISHED" | "DUE" | undefined;
            title?: string | undefined;
            amount?: number | undefined;
            remainingAmount?: number | undefined;
            loanType?: "CASH_WITH_PRODUCT" | "CASH_ONLY" | undefined;
            dueDate?: string | null | undefined;
        }, {
            status?: "PENDING" | "ACTIVE" | "FINISHED" | "DUE" | undefined;
            title?: string | undefined;
            amount?: number | undefined;
            remainingAmount?: number | undefined;
            loanType?: "CASH_WITH_PRODUCT" | "CASH_ONLY" | undefined;
            dueDate?: string | null | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status?: "PENDING" | "ACTIVE" | "FINISHED" | "DUE" | undefined;
            title?: string | undefined;
            amount?: number | undefined;
            remainingAmount?: number | undefined;
            loanType?: "CASH_WITH_PRODUCT" | "CASH_ONLY" | undefined;
            dueDate?: string | null | undefined;
        };
    }, {
        body: {
            status?: "PENDING" | "ACTIVE" | "FINISHED" | "DUE" | undefined;
            title?: string | undefined;
            amount?: number | undefined;
            remainingAmount?: number | undefined;
            loanType?: "CASH_WITH_PRODUCT" | "CASH_ONLY" | undefined;
            dueDate?: string | null | undefined;
        };
    }>;
};
//# sourceMappingURL=loan.validation.d.ts.map