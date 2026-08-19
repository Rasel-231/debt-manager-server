import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  base_url: process.env.BASE_URL || 'http://localhost:5000/api/v1',
  database_url: process.env.DATABASE_URL,
  salt_rounds: Number(process.env.SALT_ROUND || 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    expires_in: process.env.JWT_EXPIRES_IN || '1h',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  cookie: {
    name: 'accessToken',
    refreshName: 'refreshToken',
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 1000,
    refreshMaxAge: 30 * 24 * 60 * 60 * 1000,
  },
  redis_url: process.env.REDIS_URL || 'redis://localhost:6379',
};
