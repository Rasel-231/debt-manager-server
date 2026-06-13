"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, payload) => {
    const { statusCode, success, message, data, meta } = payload;
    res.status(statusCode).json({ success, message, meta, data });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=sendResponse.js.map