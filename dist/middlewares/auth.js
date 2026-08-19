"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = require("../errors/ApiError");
const tokenStore_1 = require("../shared/tokenStore");
const extractToken = (req) => {
    if (req.cookies?.[config_1.default.cookie.name]) {
        return req.cookies[config_1.default.cookie.name];
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }
    return undefined;
};
const authenticate = async (req, _res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            throw new ApiError_1.ApiError(401, 'Unauthorized: missing authentication token');
        }
        const isBlacklisted = await tokenStore_1.tokenStore.get(`blacklist:${token}`);
        if (isBlacklisted) {
            throw new ApiError_1.ApiError(401, 'Unauthorized: token has been revoked');
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new ApiError_1.ApiError(401, 'Unauthorized');
            }
            if (!allowedRoles.includes(req.user.role)) {
                throw new ApiError_1.ApiError(403, 'Forbidden: insufficient permissions');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map