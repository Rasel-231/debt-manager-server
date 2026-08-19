"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookies = exports.setAuthCookies = void 0;
const config_1 = __importDefault(require("../config"));
const getCookieDomain = () => {
    if (config_1.default.env === 'development') {
        return 'localhost';
    }
    return undefined;
};
const baseCookieOptions = (maxAge) => ({
    httpOnly: config_1.default.cookie.httpOnly,
    secure: config_1.default.cookie.secure,
    sameSite: config_1.default.cookie.sameSite,
    path: '/',
    maxAge,
    domain: getCookieDomain(),
});
const setAuthCookies = (res, tokens) => {
    res.cookie(config_1.default.cookie.name, tokens.accessToken, baseCookieOptions(config_1.default.cookie.maxAge));
    res.cookie(config_1.default.cookie.refreshName, tokens.refreshToken, baseCookieOptions(config_1.default.cookie.refreshMaxAge));
};
exports.setAuthCookies = setAuthCookies;
const clearAuthCookies = (res) => {
    res.clearCookie(config_1.default.cookie.name, { path: '/', domain: getCookieDomain() });
    res.clearCookie(config_1.default.cookie.refreshName, { path: '/', domain: getCookieDomain() });
};
exports.clearAuthCookies = clearAuthCookies;
//# sourceMappingURL=jwtCookie.js.map