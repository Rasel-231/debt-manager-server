"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1).max(100).optional(),
        role: zod_1.z.enum(['USER', 'ADMIN']).optional(),
        isActive: zod_1.z.boolean().optional(),
        password: zod_1.z.string().min(6).max(100).optional(),
    }),
});
exports.userValidation = { updateUserSchema };
//# sourceMappingURL=user.validation.js.map