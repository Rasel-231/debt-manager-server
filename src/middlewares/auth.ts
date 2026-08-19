import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ApiError } from '../errors/ApiError';
import { tokenStore } from '../shared/tokenStore';

export interface IAuthUser {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}

const extractToken = (req: Request): string | undefined => {
  if (req.cookies?.[config.cookie.name]) {
    return req.cookies[config.cookie.name];
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return undefined;
};

const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new ApiError(401, 'Unauthorized: missing authentication token');
    }

    const isBlacklisted = await tokenStore.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new ApiError(401, 'Unauthorized: token has been revoked');
    }

    const decoded = jwt.verify(token, config.jwt.secret) as IAuthUser;
    req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...allowedRoles: IAuthUser['role'][]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized');
      }
      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError(403, 'Forbidden: insufficient permissions');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { authenticate, authorize };
