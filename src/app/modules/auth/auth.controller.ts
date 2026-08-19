import { Request, Response } from 'express';
import { catchAsync } from '../../../utils/catchAsync';
import { sendResponse } from '../../../utils/sendResponse';
import { clearAuthCookies, setAuthCookies } from '../../../utils/jwtCookie';
import { AuthService } from './auth.service';

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  setAuthCookies(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Account created successfully',
    data: { user: result.user },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  setAuthCookies(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged in successfully',
    data: { user: result.user },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.['accessToken'] || '';
  if (req.user?.userId) {
    await AuthService.logout(req.user.userId, token);
  }
  clearAuthCookies(res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully',
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const refreshTokenValue = req.cookies?.['refreshToken'];
  if (!refreshTokenValue) {
    throw new Error('Refresh token is missing');
  }
  const result = await AuthService.refreshToken(refreshTokenValue);
  setAuthCookies(res, result);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tokens refreshed successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthService.getProfile(req.user!.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile fetched successfully',
    data: user,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.changePassword(req.user!.userId, req.body);
  clearAuthCookies(res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password changed successfully, please log in again',
  });
});

export const AuthController = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  changePassword,
};
