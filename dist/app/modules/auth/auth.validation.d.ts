import { z } from 'zod';
export declare const authValidation: {
    registerSchema: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            name: string;
            password: string;
        }, {
            email: string;
            name: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            name: string;
            password: string;
        };
    }, {
        body: {
            email: string;
            name: string;
            password: string;
        };
    }>;
    loginSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
        }, {
            email: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            password: string;
        };
    }, {
        body: {
            email: string;
            password: string;
        };
    }>;
    refreshTokenSchema: z.ZodObject<{
        cookies: z.ZodObject<{
            refreshToken: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            refreshToken: string;
        }, {
            refreshToken: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        cookies: {
            refreshToken: string;
        };
    }, {
        cookies: {
            refreshToken: string;
        };
    }>;
    changePasswordSchema: z.ZodObject<{
        body: z.ZodObject<{
            oldPassword: z.ZodString;
            newPassword: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            oldPassword: string;
            newPassword: string;
        }, {
            oldPassword: string;
            newPassword: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            oldPassword: string;
            newPassword: string;
        };
    }, {
        body: {
            oldPassword: string;
            newPassword: string;
        };
    }>;
};
//# sourceMappingURL=auth.validation.d.ts.map