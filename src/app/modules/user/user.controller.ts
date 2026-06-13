import { Request, Response } from 'express';
import { UserService } from './user.service';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';

const createUserAccount = catchAsync(async (req: Request, res: Response) => {
  const parsedUploadedFileCloudPathUrl = req.file?.path || '';

  const payloadResult = await UserService.processComplexUserWorkspace(
    req.body,
    parsedUploadedFileCloudPathUrl
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User workspace tracking state registered inside Postgres Engine safely!',
    data: payloadResult,
  });
});

export const UserController = {
  createUserAccount,
};
