import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import { ApiError } from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { tokenStore } from '../../../shared/tokenStore';
import { BLACKLIST_PREFIX, REFRESH_TOKEN_PREFIX, REFRESH_TOKEN_TTL } from './auth.constant';
import type {
  IAuthResponse,
  IChangePasswordPayload,
  ILoginPayload,
  IRegisterPayload,
  ISafeUser,
  ITokenPayload,
} from './auth.interface';

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ISafeUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const generateAccessToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expires_in as jwt.SignOptions['expiresIn'],
  });
};

const generateRefreshToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refresh_expires_in as jwt.SignOptions['expiresIn'],
  });
};

const issueTokens = async (
  payload: ITokenPayload
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await tokenStore.set(`${REFRESH_TOKEN_PREFIX}${payload.userId}`, refreshToken, REFRESH_TOKEN_TTL);

  return { accessToken, refreshToken };
};

const register = async (payload: IRegisterPayload): Promise<IAuthResponse> => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, config.salt_rounds);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    },
  });

  const tokens = await issueTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { ...tokens, user: sanitizeUser(user) };
};

const login = async (payload: ILoginPayload): Promise<IAuthResponse> => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const tokens = await issueTokens({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { ...tokens, user: sanitizeUser(user) };
};

const logout = async (userId: string, token: string): Promise<void> => {
  await tokenStore.del(`${REFRESH_TOKEN_PREFIX}${userId}`);
  if (token) {
    await tokenStore.set(`${BLACKLIST_PREFIX}${token}`, '1', 60 * 60);
  }
};

const refreshToken = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  let decoded: ITokenPayload;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.secret) as ITokenPayload;
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const storedToken = await tokenStore.get(`${REFRESH_TOKEN_PREFIX}${decoded.userId}`);
  if (!storedToken || storedToken !== refreshToken) {
    throw new ApiError(401, 'Refresh token is not valid');
  }

  const accessToken = generateAccessToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  const newRefreshToken = generateRefreshToken({
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  });

  await tokenStore.set(`${REFRESH_TOKEN_PREFIX}${decoded.userId}`, newRefreshToken, REFRESH_TOKEN_TTL);

  return { accessToken, refreshToken: newRefreshToken };
};

const getProfile = async (userId: string): Promise<ISafeUser> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return sanitizeUser(user);
};

const changePassword = async (
  userId: string,
  payload: IChangePasswordPayload
): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isOldPasswordValid = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, config.salt_rounds);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  await tokenStore.del(`${REFRESH_TOKEN_PREFIX}${userId}`);
};

export const AuthService = {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  changePassword,
};
