"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6).max(100),
        name: zod_1.z.string().min(1).max(100),
    }),
});
const updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100).optional(),
        password: zod_1.z.string().min(6).max(100).optional(),
    }),
});
exports.userValidation = { createUserSchema, updateUserSchema };
//# sourceMappingURL=user.validation.js.map