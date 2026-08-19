"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const sendResponse_1 = require("../../../utils/sendResponse");
const pick_1 = require("../../../utils/pick");
const transaction_constant_1 = require("./transaction.constant");
const transaction_service_1 = require("./transaction.service");
const createTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await transaction_service_1.TransactionService.createTransaction(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Transaction recorded successfully',
        data: result,
    });
});
const getAllTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filters = (0, pick_1.pick)(req.query, transaction_constant_1.transactionFilterableFields);
    const paginationOptions = (0, pick_1.pick)(req.query, [
        'page',
        'limit',
        'sortBy',
        'sortOrder',
    ]);
    const result = await transaction_service_1.TransactionService.getAllTransactions(filters, paginationOptions, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Transactions fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getTransactionById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await transaction_service_1.TransactionService.getTransactionById(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Transaction fetched successfully',
        data: result,
    });
});
const updateTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await transaction_service_1.TransactionService.updateTransaction(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Transaction updated successfully',
        data: result,
    });
});
const deleteTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await transaction_service_1.TransactionService.deleteTransaction(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Transaction deleted successfully',
    });
});
const getStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await transaction_service_1.TransactionService.getStats(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Transaction stats fetched successfully',
        data: result,
    });
});
exports.TransactionController = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getStats,
};
//# sourceMappingURL=transaction.controller.js.map