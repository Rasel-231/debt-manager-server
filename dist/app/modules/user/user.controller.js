"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const createUserAccount = (0, catchAsync_1.default)(async (req, res) => {
    const parsedUploadedFileCloudPathUrl = req.file?.path || '';
    const payloadResult = await user_service_1.UserService.processComplexUserWorkspace(req.body, parsedUploadedFileCloudPathUrl);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User workspace tracking state registered inside Postgres Engine safely!',
        data: payloadResult,
    });
});
exports.UserController = {
    createUserAccount,
};
//# sourceMappingURL=user.controller.js.map