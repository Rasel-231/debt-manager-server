import { z } from 'zod';
export declare const userValidation: {
    updateUserSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN"]>>;
            isActive: z.ZodOptional<z.ZodBoolean>;
            password: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            role?: "USER" | "ADMIN" | undefined;
            name?: string | undefined;
            password?: string | undefined;
            isActive?: boolean | undefined;
        }, {
            role?: "USER" | "ADMIN" | undefined;
            name?: string | undefined;
            password?: string | undefined;
            isActive?: boolean | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            role?: "USER" | "ADMIN" | undefined;
            name?: string | undefined;
            password?: string | undefined;
            isActive?: boolean | undefined;
        };
    }, {
        body: {
            role?: "USER" | "ADMIN" | undefined;
            name?: string | undefined;
            password?: string | undefined;
            isActive?: boolean | undefined;
        };
    }>;
};
//# sourceMappingURL=user.validation.d.ts.map