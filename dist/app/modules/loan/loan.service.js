"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanService = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = require("../../../errors/ApiError");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../shared/paginationHelper");
const loan_constant_1 = require("./loan.constant");
const isOwnerOrAdmin = (loanUserId, authUser) => loanUserId === authUser.userId || authUser.role === 'ADMIN';
const refreshLoanStatuses = async (userId) => {
    const now = new Date();
    const overdueWhere = {
        remainingAmount: { gt: 0 },
        status: { in: [client_1.LoanStatus.PENDING, client_1.LoanStatus.ACTIVE] },
        dueDate: { lt: now },
        ...(userId && { userId }),
    };
    await prisma_1.default.loan.updateMany({ where: overdueWhere, data: { status: client_1.LoanStatus.DUE } });
    const finishedWhere = {
        remainingAmount: { lte: 0 },
        status: { not: client_1.LoanStatus.FINISHED },
        ...(userId && { userId }),
    };
    await prisma_1.default.loan.updateMany({ where: finishedWhere, data: { status: client_1.LoanStatus.FINISHED } });
};
const createLoan = async (payload, authUser) => {
    const loan = await prisma_1.default.loan.create({
        data: {
            userId: authUser.userId,
            title: payload.title,
            amount: payload.amount,
            remainingAmount: payload.amount,
            loanType: payload.loanType,
            status: client_1.LoanStatus.PENDING,
            dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
        },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
    await refreshLoanStatuses(authUser.userId);
    return loan;
};
const getAllLoans = async (filters, paginationOptions, authUser) => {
    await refreshLoanStatuses(authUser.role === 'ADMIN' ? undefined : authUser.userId);
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const whereConditions = {};
    if (authUser.role !== 'ADMIN') {
        whereConditions.userId = authUser.userId;
    }
    if (searchTerm) {
        whereConditions.OR = [{ title: { contains: searchTerm, mode: 'insensitive' } }];
    }
    if (filterData.loanType) {
        whereConditions.loanType = filterData.loanType;
    }
    if (filterData.status) {
        whereConditions.status = filterData.status;
    }
    if (filterData.minAmount || filterData.maxAmount) {
        whereConditions.amount = {
            ...(filterData.minAmount && { gte: Number(filterData.minAmount) }),
            ...(filterData.maxAmount && { lte: Number(filterData.maxAmount) }),
        };
    }
    if (filterData.fromDate || filterData.toDate) {
        whereConditions.createdAt = {
            ...(filterData.fromDate && { gte: new Date(filterData.fromDate) }),
            ...(filterData.toDate && { lte: new Date(filterData.toDate) }),
        };
    }
    if (filterData.dueFrom || filterData.dueTo) {
        whereConditions.dueDate = {
            ...(filterData.dueFrom && { gte: new Date(filterData.dueFrom) }),
            ...(filterData.dueTo && { lte: new Date(filterData.dueTo) }),
        };
    }
    const orderByField = loan_constant_1.loanSortableFields.includes(sortBy) ? sortBy : 'createdAt';
    const result = await prisma_1.default.loan.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
        include: {
            user: { select: { id: true, name: true, email: true } },
            _count: { select: { transactions: true } },
        },
    });
    const total = await prisma_1.default.loan.count({ where: whereConditions });
    return {
        meta: { page, limit, total },
        data: result,
    };
};
const getLoanById = async (id, authUser) => {
    const loan = await prisma_1.default.loan.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true } },
            transactions: { orderBy: { paymentDate: 'desc' } },
        },
    });
    if (!loan) {
        throw new ApiError_1.ApiError(404, 'Loan not found');
    }
    if (!isOwnerOrAdmin(loan.userId, authUser)) {
        throw new ApiError_1.ApiError(403, 'Forbidden: you do not own this loan');
    }
    return loan;
};
const updateLoan = async (id, payload, authUser) => {
    const loan = await prisma_1.default.loan.findUnique({ where: { id } });
    if (!loan) {
        throw new ApiError_1.ApiError(404, 'Loan not found');
    }
    if (!isOwnerOrAdmin(loan.userId, authUser)) {
        throw new ApiError_1.ApiError(403, 'Forbidden: you do not own this loan');
    }
    const newAmount = payload.amount ?? loan.amount;
    const newRemaining = payload.remainingAmount !== undefined
        ? payload.remainingAmount
        : payload.amount !== undefined
            ? Math.min(loan.remainingAmount, newAmount)
            : loan.remainingAmount;
    if (newRemaining > newAmount) {
        throw new ApiError_1.ApiError(400, 'Remaining amount cannot exceed total amount');
    }
    let status = payload.status;
    if (!status) {
        status = newRemaining === 0 ? client_1.LoanStatus.FINISHED : undefined;
    }
    const updatedLoan = await prisma_1.default.loan.update({
        where: { id },
        data: {
            ...(payload.title !== undefined && { title: payload.title }),
            ...(newAmount !== loan.amount && { amount: newAmount }),
            ...(newRemaining !== loan.remainingAmount && { remainingAmount: newRemaining }),
            ...(payload.loanType !== undefined && { loanType: payload.loanType }),
            ...(status !== undefined && { status }),
            ...(payload.dueDate !== undefined && { dueDate: payload.dueDate ? new Date(payload.dueDate) : null }),
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
            _count: { select: { transactions: true } },
        },
    });
    await refreshLoanStatuses(loan.userId);
    return updatedLoan;
};
const deleteLoan = async (id, authUser) => {
    const loan = await prisma_1.default.loan.findUnique({ where: { id } });
    if (!loan) {
        throw new ApiError_1.ApiError(404, 'Loan not found');
    }
    if (!isOwnerOrAdmin(loan.userId, authUser)) {
        throw new ApiError_1.ApiError(403, 'Forbidden: you do not own this loan');
    }
    await prisma_1.default.loan.delete({ where: { id } });
};
const getSummary = async (authUser) => {
    await refreshLoanStatuses(authUser.role === 'ADMIN' ? undefined : authUser.userId);
    const userScope = authUser.role === 'ADMIN' ? {} : { userId: authUser.userId };
    const transactionScope = authUser.role === 'ADMIN' ? {} : { userId: authUser.userId };
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const criticalCutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8);
    const weekAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
    const trendStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const [totalLoans, statusBreakdown, typeBreakdown, payments, loansForTrend, criticalLoans, finishedLoans, newLoans] = await Promise.all([
        prisma_1.default.loan.aggregate({
            where: userScope,
            _count: { _all: true },
            _sum: { amount: true, remainingAmount: true },
        }),
        prisma_1.default.loan.groupBy({
            by: ['status'],
            where: userScope,
            _count: { _all: true },
            _sum: { amount: true, remainingAmount: true },
        }),
        prisma_1.default.loan.groupBy({
            by: ['loanType'],
            where: userScope,
            _count: { _all: true },
            _sum: { amount: true, remainingAmount: true },
        }),
        prisma_1.default.transaction.findMany({
            where: { ...transactionScope, paymentDate: { gte: trendStart } },
            select: { id: true, amountPaid: true, type: true, paymentDate: true },
        }),
        prisma_1.default.loan.findMany({
            where: { ...userScope, createdAt: { gte: trendStart } },
            select: { createdAt: true },
        }),
        prisma_1.default.loan.findMany({
            where: {
                ...userScope,
                remainingAmount: { gt: 0 },
                status: { in: [client_1.LoanStatus.PENDING, client_1.LoanStatus.ACTIVE, client_1.LoanStatus.DUE] },
                dueDate: { lt: criticalCutoff },
            },
            orderBy: { dueDate: 'asc' },
            take: 10,
            include: { user: { select: { id: true, name: true, email: true } } },
        }),
        prisma_1.default.loan.findMany({
            where: { ...userScope, status: client_1.LoanStatus.FINISHED },
            orderBy: { updatedAt: 'desc' },
            take: 10,
            include: { user: { select: { id: true, name: true, email: true } } },
        }),
        prisma_1.default.loan.findMany({
            where: { ...userScope, createdAt: { gte: weekAgo } },
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { user: { select: { id: true, name: true, email: true } } },
        }),
    ]);
    const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthlyTrendMap = new Map();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthlyTrendMap.set(monthKey(d), { added: 0, paid: 0 });
    }
    for (const loan of loansForTrend) {
        const key = monthKey(loan.createdAt);
        if (!monthlyTrendMap.has(key))
            continue;
        monthlyTrendMap.get(key).added += 1;
    }
    for (const tx of payments) {
        const key = monthKey(tx.paymentDate);
        if (!monthlyTrendMap.has(key))
            continue;
        if (tx.type === 'PAYMENT') {
            monthlyTrendMap.get(key).paid += tx.amountPaid;
        }
    }
    const totalPaid = payments
        .filter((p) => p.type === 'PAYMENT')
        .reduce((sum, p) => sum + p.amountPaid, 0);
    const totalDeposited = payments
        .filter((p) => p.type === 'DEPOSIT')
        .reduce((sum, p) => sum + p.amountPaid, 0);
    return {
        totals: {
            totalLoans: totalLoans._count._all,
            totalAmount: totalLoans._sum.amount ?? 0,
            totalRemaining: totalLoans._sum.remainingAmount ?? 0,
            totalPaid,
            totalDeposited,
        },
        statusBreakdown,
        typeBreakdown,
        monthlyTrend: Array.from(monthlyTrendMap, ([month, value]) => ({ month, ...value })),
        criticalLoans,
        finishedLoans,
        newLoans,
    };
};
exports.LoanService = {
    createLoan,
    getAllLoans,
    getLoanById,
    updateLoan,
    deleteLoan,
    getSummary,
    refreshLoanStatuses,
};
//# sourceMappingURL=loan.service.js.map