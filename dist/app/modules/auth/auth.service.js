"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = require("../../../errors/ApiError");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const tokenStore_1 = require("../../../shared/tokenStore");
const auth_constant_1 = require("./auth.constant");
const sanitizeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
});
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret, {
        expiresIn: config_1.default.jwt.expires_in,
    });
};
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret, {
        expiresIn: config_1.default.jwt.refresh_expires_in,
    });
};
const issueTokens = async (payload) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await tokenStore_1.tokenStore.set(`${auth_constant_1.REFRESH_TOKEN_PREFIX}${payload.userId}`, refreshToken, auth_constant_1.REFRESH_TOKEN_TTL);
    return { accessToken, refreshToken };
};
const register = async (payload) => {
    const existingUser = await prisma_1.default.user.findUnique({ where: { email: payload.email } });
    if (existingUser) {
        throw new ApiError_1.ApiError(409, 'An account with this email already exists');
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, config_1.default.salt_rounds);
    const user = await prisma_1.default.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
        },
    });
    const tokens = await issueTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return { ...tokens, user: sanitizeUser(user) };
};
const login = async (payload) => {
    const user = await prisma_1.default.user.findUnique({ where: { email: payload.email } });
    if (!user) {
        throw new ApiError_1.ApiError(401, 'Invalid email or password');
    }
    const isPasswordValid = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, 'Invalid email or password');
    }
    if (!user.isActive) {
        throw new ApiError_1.ApiError(403, 'This account has been deactivated');
    }
    const tokens = await issueTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
    });
    return { ...tokens, user: sanitizeUser(user) };
};
const logout = async (userId, token) => {
    await tokenStore_1.tokenStore.del(`${auth_constant_1.REFRESH_TOKEN_PREFIX}${userId}`);
    if (token) {
        await tokenStore_1.tokenStore.set(`${auth_constant_1.BLACKLIST_PREFIX}${token}`, '1', 60 * 60);
    }
};
const refreshToken = async (refreshToken) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.default.jwt.secret);
    }
    catch {
        throw new ApiError_1.ApiError(401, 'Invalid or expired refresh token');
    }
    const storedToken = await tokenStore_1.tokenStore.get(`${auth_constant_1.REFRESH_TOKEN_PREFIX}${decoded.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
        throw new ApiError_1.ApiError(401, 'Refresh token is not valid');
    }
    const accessToken = generateAccessToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
    });
    const newRefreshToken = generateRefreshToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
    });
    await tokenStore_1.tokenStore.set(`${auth_constant_1.REFRESH_TOKEN_PREFIX}${decoded.userId}`, newRefreshToken, auth_constant_1.REFRESH_TOKEN_TTL);
    return { accessToken, refreshToken: newRefreshToken };
};
const getProfile = async (userId) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    return sanitizeUser(user);
};
const changePassword = async (userId, payload) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found');
    }
    const isOldPasswordValid = await bcrypt_1.default.compare(payload.oldPassword, user.password);
    if (!isOldPasswordValid) {
        throw new ApiError_1.ApiError(400, 'Current password is incorrect');
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, config_1.default.salt_rounds);
    await prisma_1.default.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    await tokenStore_1.tokenStore.del(`${auth_constant_1.REFRESH_TOKEN_PREFIX}${userId}`);
};
exports.AuthService = {
    register,
    login,
    logout,
    refreshToken,
    getProfile,
    changePassword,
};
//# sourceMappingURL=auth.service.js.map