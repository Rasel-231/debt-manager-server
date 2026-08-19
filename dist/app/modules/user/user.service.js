"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = require("../../../errors/ApiError");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../shared/paginationHelper");
const user_constant_1 = require("./user.constant");
const getAllUsers = async (filters, paginationOptions) => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: user_constant_1.userSearchableFields.map((field) => ({
                [field]: { contains: searchTerm, mode: 'insensitive' },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([key, value]) => {
                if (key === 'isActive') {
                    return { isActive: value === 'true' };
                }
                return { [key]: value };
            }),
        });
    }
    const whereConditions = andConditions.length
        ? { AND: andConditions }
        : {};
    const result = await prisma_1.default.user.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { loans: true, transactions: true } },
        },
    });
    const total = await prisma_1.default.user.count({ where: whereConditions });
    return {
        meta: { page, limit, total },
        data: result,
    };
};
const getUserById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { loans: true, transactions: true } },
        },
    });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    return user;
};
const updateUser = async (id, payload) => {
    const existingUser = await prisma_1.default.user.findUnique({ where: { id } });
    if (!existingUser) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    const data = {
        ...(payload.name !== undefined && { name: payload.name }),
        ...(payload.role !== undefined && { role: payload.role }),
        ...(payload.isActive !== undefined && { isActive: payload.isActive }),
        ...(payload.password !== undefined && {
            password: await bcrypt_1.default.hash(payload.password, config_1.default.salt_rounds),
        }),
    };
    const updatedUser = await prisma_1.default.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
};
const deleteUser = async (id) => {
    const existingUser = await prisma_1.default.user.findUnique({ where: { id } });
    if (!existingUser) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    await prisma_1.default.user.delete({ where: { id } });
};
exports.UserService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=user.service.js.map