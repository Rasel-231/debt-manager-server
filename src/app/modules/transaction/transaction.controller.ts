import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import { pick } from '../../../utils/pick';
import { transactionFilterableFields } from './transaction.constant';
import { TransactionService } from './transaction.service';

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.createTransaction(req.body, req.user!);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Transaction recorded successfully',
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, transactionFilterableFields);
  const paginationOptions = pick(req.query, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]) as unknown as { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' };

  const result = await TransactionService.getAllTransactions(filters, paginationOptions, req.user!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transactions fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getTransactionById(req.params.id, req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transaction fetched successfully',
    data: result,
  });
});

const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.updateTransaction(req.params.id, req.body, req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transaction updated successfully',
    data: result,
  });
});

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  await TransactionService.deleteTransaction(req.params.id, req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transaction deleted successfully',
  });
});

const getStats = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getStats(req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transaction stats fetched successfully',
    data: result,
  });
});

export const TransactionController = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getStats,
};
