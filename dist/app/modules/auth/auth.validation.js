"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').max(100),
        email: zod_1.z.string().email('A valid email is required'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters').max(100),
    }),
});
const loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('A valid email is required'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
const refreshTokenSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, 'Refresh token is required'),
    }),
});
const changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string().min(1, 'Old password is required'),
        newPassword: zod_1.z.string().min(6, 'New password must be at least 6 characters').max(100),
    }),
});
exports.authValidation = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    changePasswordSchema,
};
//# sourceMappingURL=auth.validation.js.map