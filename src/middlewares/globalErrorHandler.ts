import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';

export const globalErrorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorDetails: any = undefined;

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error?.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = error.issues;
  } else if (error instanceof Error) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errorDetails && { errorDetails }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
