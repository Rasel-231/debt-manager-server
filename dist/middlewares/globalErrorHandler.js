"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const ApiError_1 = require("../errors/ApiError");
const globalErrorHandler = (error, _req, res, _next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorDetails = undefined;
    if (error instanceof ApiError_1.ApiError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error?.name === 'ZodError') {
        statusCode = 400;
        message = 'Validation Error';
        errorDetails = error.issues;
    }
    else if (error instanceof Error) {
        message = error.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(errorDetails && { errorDetails }),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map