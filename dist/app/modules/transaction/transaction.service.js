"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = require("../../../errors/ApiError");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../shared/paginationHelper");
const isOwnerOrAdmin = (resourceUserId, authUser) => resourceUserId === authUser.userId || authUser.role === 'ADMIN';
const computeNextStatus = (remainingAmount, dueDate) => {
    if (remainingAmount <= 0)
        return client_1.LoanStatus.FINISHED;
    if (dueDate && dueDate < new Date())
        return client_1.LoanStatus.DUE;
    return client_1.LoanStatus.ACTIVE;
};
const ensureLoanAccess = async (loanId, authUser) => {
    const loan = await prisma_1.default.loan.findUnique({ where: { id: loanId } });
    if (!loan) {
        throw new ApiError_1.ApiError(404, 'Loan not found');
    }
    if (!isOwnerOrAdmin(loan.userId, authUser)) {
        throw new ApiError_1.ApiError(403, 'Forbidden: you do not own this loan');
    }
    return loan;
};
const createTransaction = async (payload, authUser) => {
    const loan = await ensureLoanAccess(payload.loanId, authUser);
    return prisma_1.default.$transaction(async (tx) => {
        if (payload.type === 'PAYMENT' && payload.amountPaid > loan.remainingAmount) {
            throw new ApiError_1.ApiError(400, `Payment amount cannot exceed the remaining balance of ${loan.remainingAmount}`);
        }
        const transaction = await tx.transaction.create({
            data: {
                loanId: payload.loanId,
                userId: authUser.userId,
                amountPaid: payload.amountPaid,
                type: payload.type,
                paymentDate: payload.paymentDate ? new Date(payload.paymentDate) : new Date(),
                notes: payload.notes ?? null,
            },
            include: { loan: { select: { id: true, title: true } } },
        });
        const remainingAmount = payload.type === 'PAYMENT'
            ? loan.remainingAmount - payload.amountPaid
            : loan.remainingAmount + payload.amountPaid;
        const updatedLoan = await tx.loan.update({
            where: { id: loan.id },
            data: {
                remainingAmount,
                status: computeNextStatus(remainingAmount, loan.dueDate),
            },
            select: { id: true, title: true, amount: true, remainingAmount: true, status: true },
        });
        return { transaction, updatedLoan };
    });
};
const getAllTransactions = async (filters, paginationOptions, authUser) => {
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const whereConditions = {};
    if (authUser.role !== 'ADMIN') {
        whereConditions.userId = authUser.userId;
    }
    if (searchTerm) {
        whereConditions.OR = [{ notes: { contains: searchTerm, mode: 'insensitive' } }];
    }
    if (filterData.loanId) {
        whereConditions.loanId = filterData.loanId;
    }
    if (filterData.type) {
        whereConditions.type = filterData.type;
    }
    if (filterData.fromDate || filterData.toDate) {
        whereConditions.paymentDate = {
            ...(filterData.fromDate && { gte: new Date(filterData.fromDate) }),
            ...(filterData.toDate && { lte: new Date(filterData.toDate) }),
        };
    }
    const result = await prisma_1.default.transaction.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
            loan: { select: { id: true, title: true, loanType: true } },
            user: { select: { id: true, name: true, email: true } },
        },
    });
    const total = await prisma_1.default.transaction.count({ where: whereConditions });
    return {
        meta: { page, limit, total },
        data: result,
    };
};
const getTransactionById = async (id, authUser) => {
    const transaction = await prisma_1.default.transaction.findUnique({
        where: { id },
        include: { loan: { select: { id: true, title: true } } },
    });
    if (!transaction) {
        throw new ApiError_1.ApiError(404, 'Transaction not found');
    }
    if (!isOwnerOrAdmin(transaction.userId, authUser)) {
        throw new ApiError_1.ApiError(403, 'Forbidden: you do not own this transaction');
    }
    return transaction;
};
const updateTransaction = async (id, payload, authUser) => {
    const transaction = await prisma_1.default.transaction.findUnique({ where: { id } });
    if (!transaction) {
        throw new ApiError_1.ApiError(404, 'Transaction not found');
    }
    if (!isOwnerOrAdmin(transaction.userId, authUser)) {
        throw new ApiError_1.ApiError(403, 'Forbidden: you do not own this transaction');
    }
    const loan = await prisma_1.default.loan.findUnique({ where: { id: transaction.loanId } });
    if (!loan) {
        throw new ApiError_1.ApiError(404, 'Loan not found');
    }
    const oldAmount = transaction.amountPaid;
    const oldType = transaction.type;
    const newAmount = payload.amountPaid ?? oldAmount;
    const newType = payload.type ?? oldType;
    const reverseDelta = oldType === 'PAYMENT' ? -oldAmount : oldAmount;
    const applyDelta = newType === 'PAYMENT' ? -newAmount : newAmount;
    const baseRemaining = loan.remainingAmount - reverseDelta;
    const newRemaining = baseRemaining + applyDelta;
    if (newRemaining < 0) {
        throw new ApiError_1.ApiError(400, 'Transaction update would make the loan balance negative');
    }
    return prisma_1.default.$transaction(async (tx) => {
        const updated = await tx.transaction.update({
            where: { id },
            data: {
                amountPaid: newAmount,
                type: newType,
                paymentDate: payload.paymentDate !== undefined ? (payload.paymentDate ? new Date(payload.paymentDate) : new Date()) : transaction.paymentDate,
                notes: payload.notes !== undefined ? payload.notes : transaction.notes,
            },
            include: { loan: { select: { id: true, title: true } } },
        });
        await tx.loan.update({
            where: { id: loan.id },
            data: {
                remainingAmount: newRemaining,
                status: computeNextStatus(newRemaining, loan.dueDate),
            },
        });
        return updated;
    });
};
const deleteTransaction = async (id, authUser) => {
    const transaction = await prisma_1.default.transaction.findUnique({ where: { id } });
    if (!transaction) {
        throw new ApiError_1.ApiError(404, 'Transaction not found');
    }
    if (!isOwnerOrAdmin(transaction.userId, authUser)) {
        throw new ApiError_1.ApiError(403, 'Forbidden: you do not own this transaction');
    }
    const loan = await prisma_1.default.loan.findUnique({ where: { id: transaction.loanId } });
    if (!loan) {
        throw new ApiError_1.ApiError(404, 'Loan not found');
    }
    const reverseDelta = transaction.type === 'PAYMENT' ? -transaction.amountPaid : transaction.amountPaid;
    const newRemaining = loan.remainingAmount - reverseDelta;
    await prisma_1.default.$transaction(async (tx) => {
        await tx.loan.update({
            where: { id: loan.id },
            data: {
                remainingAmount: newRemaining,
                status: computeNextStatus(newRemaining, loan.dueDate),
            },
        });
        await tx.transaction.delete({ where: { id } });
    });
};
const getStats = async (authUser) => {
    const scope = authUser.role === 'ADMIN' ? {} : { userId: authUser.userId };
    const [aggregate, payments, deposits, count, recent] = await Promise.all([
        prisma_1.default.transaction.aggregate({ where: scope, _sum: { amountPaid: true }, _count: { _all: true } }),
        prisma_1.default.transaction.aggregate({
            where: { ...scope, type: client_1.TransactionType.PAYMENT },
            _sum: { amountPaid: true },
        }),
        prisma_1.default.transaction.aggregate({
            where: { ...scope, type: client_1.TransactionType.DEPOSIT },
            _sum: { amountPaid: true },
        }),
        prisma_1.default.transaction.count({ where: scope }),
        prisma_1.default.transaction.findMany({
            where: scope,
            orderBy: { paymentDate: 'desc' },
            take: 10,
            include: { loan: { select: { id: true, title: true } } },
        }),
    ]);
    return {
        totalAmount: aggregate._sum.amountPaid ?? 0,
        totalPaid: payments._sum.amountPaid ?? 0,
        totalDeposited: deposits._sum.amountPaid ?? 0,
        totalCount: count,
        recent,
    };
};
exports.TransactionService = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getStats,
};
//# sourceMappingURL=transaction.service.js.map