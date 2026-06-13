import { z } from 'zod';
export declare const userValidation: {
    createUserSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
            name: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name: string;
            email: string;
            password: string;
        }, {
            name: string;
            email: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            name: string;
            email: string;
            password: string;
        };
    }, {
        body: {
            name: string;
            email: string;
            password: string;
        };
    }>;
    updateUserSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            password: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name?: string | undefined;
            password?: string | undefined;
        }, {
            name?: string | undefined;
            password?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            name?: string | undefined;
            password?: string | undefined;
        };
    }, {
        body: {
            name?: string | undefined;
            password?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=user.validation.d.ts.map