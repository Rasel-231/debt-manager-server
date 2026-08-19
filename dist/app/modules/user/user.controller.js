"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const sendResponse_1 = require("../../../utils/sendResponse");
const pick_1 = require("../../../utils/pick");
const user_constant_1 = require("./user.constant");
const user_service_1 = require("./user.service");
const getAllUsers = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filters = (0, pick_1.pick)(req.query, user_constant_1.userFilterableFields);
    const paginationOptions = (0, pick_1.pick)(req.query, [
        'page',
        'limit',
        'sortBy',
        'sortOrder',
    ]);
    const result = await user_service_1.UserService.getAllUsers(filters, paginationOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Users fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getUserById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserService.getUserById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'User fetched successfully',
        data: result,
    });
});
const updateUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await user_service_1.UserService.updateUser(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});
const deleteUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await user_service_1.UserService.deleteUser(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'User deleted successfully',
    });
});
exports.UserController = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=user.controller.js.map