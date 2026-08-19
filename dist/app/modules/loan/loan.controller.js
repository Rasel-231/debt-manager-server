"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanController = void 0;
const catchAsync_1 = require("../../../utils/catchAsync");
const sendResponse_1 = require("../../../utils/sendResponse");
const pick_1 = require("../../../utils/pick");
const loan_constant_1 = require("./loan.constant");
const loan_service_1 = require("./loan.service");
const createLoan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await loan_service_1.LoanService.createLoan(req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: 'Loan created successfully',
        data: result,
    });
});
const getAllLoans = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const filters = (0, pick_1.pick)(req.query, loan_constant_1.loanFilterableFields);
    const paginationOptions = (0, pick_1.pick)(req.query, [
        'page',
        'limit',
        'sortBy',
        'sortOrder',
    ]);
    const result = await loan_service_1.LoanService.getAllLoans(filters, paginationOptions, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Loans fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getLoanById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await loan_service_1.LoanService.getLoanById(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Loan fetched successfully',
        data: result,
    });
});
const updateLoan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await loan_service_1.LoanService.updateLoan(req.params.id, req.body, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Loan updated successfully',
        data: result,
    });
});
const deleteLoan = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await loan_service_1.LoanService.deleteLoan(req.params.id, req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Loan deleted successfully',
    });
});
const getSummary = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await loan_service_1.LoanService.getSummary(req.user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'Loan summary fetched successfully',
        data: result,
    });
});
exports.LoanController = {
    createLoan,
    getAllLoans,
    getLoanById,
    updateLoan,
    deleteLoan,
    getSummary,
};
//# sourceMappingURL=loan.controller.js.map