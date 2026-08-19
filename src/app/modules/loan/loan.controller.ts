import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import { pick } from '../../../utils/pick';
import { loanFilterableFields } from './loan.constant';
import { LoanService } from './loan.service';

const createLoan = catchAsync(async (req: Request, res: Response) => {
  const result = await LoanService.createLoan(req.body, req.user!);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Loan created successfully',
    data: result,
  });
});

const getAllLoans = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, loanFilterableFields);
  const paginationOptions = pick(req.query, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]) as unknown as { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' };

  const result = await LoanService.getAllLoans(filters, paginationOptions, req.user!);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Loans fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getLoanById = catchAsync(async (req: Request, res: Response) => {
  const result = await LoanService.getLoanById(req.params.id, req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Loan fetched successfully',
    data: result,
  });
});

const updateLoan = catchAsync(async (req: Request, res: Response) => {
  const result = await LoanService.updateLoan(req.params.id, req.body, req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Loan updated successfully',
    data: result,
  });
});

const deleteLoan = catchAsync(async (req: Request, res: Response) => {
  await LoanService.deleteLoan(req.params.id, req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Loan deleted successfully',
  });
});

const getSummary = catchAsync(async (req: Request, res: Response) => {
  const result = await LoanService.getSummary(req.user!);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Loan summary fetched successfully',
    data: result,
  });
});

export const LoanController = {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  getSummary,
};
