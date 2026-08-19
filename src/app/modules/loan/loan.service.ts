import { LoanStatus, Prisma } from '@prisma/client';
import { IAuthUser } from '../../../middlewares/auth';
import { ApiError } from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { paginationHelper } from '../../../shared/paginationHelper';
import { loanSortableFields } from './loan.constant';
import type { ICreateLoanPayload, ILoanFilters, IUpdateLoanPayload } from './loan.interface';

const isOwnerOrAdmin = (loanUserId: string, authUser: IAuthUser): boolean =>
  loanUserId === authUser.userId || authUser.role === 'ADMIN';

const refreshLoanStatuses = async (userId?: string): Promise<void> => {
  const now = new Date();

  const overdueWhere: Prisma.LoanWhereInput = {
    remainingAmount: { gt: 0 },
    status: { in: [LoanStatus.PENDING, LoanStatus.ACTIVE] },
    dueDate: { lt: now },
    ...(userId && { userId }),
  };
  await prisma.loan.updateMany({ where: overdueWhere, data: { status: LoanStatus.DUE } });

  const finishedWhere: Prisma.LoanWhereInput = {
    remainingAmount: { lte: 0 },
    status: { not: LoanStatus.FINISHED },
    ...(userId && { userId }),
  };
  await prisma.loan.updateMany({ where: finishedWhere, data: { status: LoanStatus.FINISHED } });
};

const createLoan = async (payload: ICreateLoanPayload, authUser: IAuthUser): Promise<unknown> => {
  const loan = await prisma.loan.create({
    data: {
      userId: authUser.userId,
      title: payload.title,
      amount: payload.amount,
      remainingAmount: payload.amount,
      loanType: payload.loanType,
      status: LoanStatus.PENDING,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  await refreshLoanStatuses(authUser.userId);
  return loan;
};

const getAllLoans = async (
  filters: ILoanFilters,
  paginationOptions: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' },
  authUser: IAuthUser
): Promise<IGenericResponse<unknown>> => {
  await refreshLoanStatuses(authUser.role === 'ADMIN' ? undefined : authUser.userId);

  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const whereConditions: Prisma.LoanWhereInput = {};

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

  const orderByField = loanSortableFields.includes(sortBy) ? sortBy : 'createdAt';

  const result = await prisma.loan.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [orderByField]: sortOrder },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { transactions: true } },
    },
  });

  const total = await prisma.loan.count({ where: whereConditions });

  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getLoanById = async (id: string, authUser: IAuthUser): Promise<unknown> => {
  const loan = await prisma.loan.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      transactions: { orderBy: { paymentDate: 'desc' } },
    },
  });

  if (!loan) {
    throw new ApiError(404, 'Loan not found');
  }

  if (!isOwnerOrAdmin(loan.userId, authUser)) {
    throw new ApiError(403, 'Forbidden: you do not own this loan');
  }

  return loan;
};

const updateLoan = async (
  id: string,
  payload: IUpdateLoanPayload,
  authUser: IAuthUser
): Promise<unknown> => {
  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) {
    throw new ApiError(404, 'Loan not found');
  }

  if (!isOwnerOrAdmin(loan.userId, authUser)) {
    throw new ApiError(403, 'Forbidden: you do not own this loan');
  }

  const newAmount = payload.amount ?? loan.amount;
  const newRemaining =
    payload.remainingAmount !== undefined
      ? payload.remainingAmount
      : payload.amount !== undefined
      ? Math.min(loan.remainingAmount, newAmount)
      : loan.remainingAmount;

  if (newRemaining > newAmount) {
    throw new ApiError(400, 'Remaining amount cannot exceed total amount');
  }

  let status = payload.status;
  if (!status) {
    status = newRemaining === 0 ? LoanStatus.FINISHED : undefined;
  }

  const updatedLoan = await prisma.loan.update({
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

const deleteLoan = async (id: string, authUser: IAuthUser): Promise<void> => {
  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) {
    throw new ApiError(404, 'Loan not found');
  }

  if (!isOwnerOrAdmin(loan.userId, authUser)) {
    throw new ApiError(403, 'Forbidden: you do not own this loan');
  }

  await prisma.loan.delete({ where: { id } });
};

const getSummary = async (authUser: IAuthUser): Promise<unknown> => {
  await refreshLoanStatuses(authUser.role === 'ADMIN' ? undefined : authUser.userId);

  const userScope: Prisma.LoanWhereInput =
    authUser.role === 'ADMIN' ? {} : { userId: authUser.userId };

  const transactionScope: Prisma.TransactionWhereInput =
    authUser.role === 'ADMIN' ? {} : { userId: authUser.userId };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const criticalCutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8);
  const weekAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
  const trendStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [totalLoans, statusBreakdown, typeBreakdown, payments, loansForTrend, criticalLoans, finishedLoans, newLoans] =
    await Promise.all([
      prisma.loan.aggregate({
        where: userScope,
        _count: { _all: true },
        _sum: { amount: true, remainingAmount: true },
      }),
      prisma.loan.groupBy({
        by: ['status'],
        where: userScope,
        _count: { _all: true },
        _sum: { amount: true, remainingAmount: true },
      }),
      prisma.loan.groupBy({
        by: ['loanType'],
        where: userScope,
        _count: { _all: true },
        _sum: { amount: true, remainingAmount: true },
      }),
      prisma.transaction.findMany({
        where: { ...transactionScope, paymentDate: { gte: trendStart } },
        select: { id: true, amountPaid: true, type: true, paymentDate: true },
      }),
      prisma.loan.findMany({
        where: { ...userScope, createdAt: { gte: trendStart } },
        select: { createdAt: true },
      }),
      prisma.loan.findMany({
        where: {
          ...userScope,
          remainingAmount: { gt: 0 },
          status: { in: [LoanStatus.PENDING, LoanStatus.ACTIVE, LoanStatus.DUE] },
          dueDate: { lt: criticalCutoff },
        },
        orderBy: { dueDate: 'asc' },
        take: 10,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.loan.findMany({
        where: { ...userScope, status: LoanStatus.FINISHED },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.loan.findMany({
        where: { ...userScope, createdAt: { gte: weekAgo } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
    ]);

  const monthKey = (date: Date): string =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

  const monthlyTrendMap = new Map<string, { added: number; paid: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyTrendMap.set(monthKey(d), { added: 0, paid: 0 });
  }

  for (const loan of loansForTrend) {
    const key = monthKey(loan.createdAt);
    if (!monthlyTrendMap.has(key)) continue;
    monthlyTrendMap.get(key)!.added += 1;
  }

  for (const tx of payments) {
    const key = monthKey(tx.paymentDate);
    if (!monthlyTrendMap.has(key)) continue;
    if (tx.type === 'PAYMENT') {
      monthlyTrendMap.get(key)!.paid += tx.amountPaid;
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

export const LoanService = {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  getSummary,
  refreshLoanStatuses,
};
