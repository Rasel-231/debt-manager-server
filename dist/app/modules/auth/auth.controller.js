"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const sendResponse_1 = require("../../../utils/sendResponse");
const jwtCookie_1 = require("../../../utils/jwtCookie");
const auth_service_1 = require("./auth.service");
const register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.register(req.body);
    (0, jwtCookie_1.setAuthCookies)(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Account created successfully',
        data: { user: result.user },
    });
});
const login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await auth_service_1.AuthService.login(req.body);
    (0, jwtCookie_1.setAuthCookies)(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Logged in successfully',
        data: { user: result.user },
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const token = req.cookies?.['accessToken'] || '';
    if (req.user?.userId) {
        await auth_service_1.AuthService.logout(req.user.userId, token);
    }
    (0, jwtCookie_1.clearAuthCookies)(res);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Logged out successfully',
    });
});
const refreshToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const refreshTokenValue = req.cookies?.['refreshToken'];
    if (!refreshTokenValue) {
        throw new Error('Refresh token is missing');
    }
    const result = await auth_service_1.AuthService.refreshToken(refreshTokenValue);
    (0, jwtCookie_1.setAuthCookies)(res, result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Tokens refreshed successfully',
        data: result,
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = await auth_service_1.AuthService.getProfile(req.user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Profile fetched successfully',
        data: user,
    });
});
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await auth_service_1.AuthService.changePassword(req.user.userId, req.body);
    (0, jwtCookie_1.clearAuthCookies)(res);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Password changed successfully, please log in again',
    });
});
exports.AuthController = {
    register,
    login,
    logout,
    refreshToken,
    getMe,
    changePassword,
};
//# sourceMappingURL=auth.controller.js.map