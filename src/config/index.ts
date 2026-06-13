import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  frontend_url: process.env.FRONTEND_URL,
  base_url: process.env.BASE_URL,
  database_url: process.env.DATABASE_URL,
  salt_rounds: Number(process.env.SALT_ROUND || 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    expires_in: process.env.JWT_EXPIRES_IN || '1h',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
  ai_api_key: process.env.AI_API_KEY,
  sslcommerz: {
    store_id: process.env.Store_ID,
    store_password: process.env.Store_Password,
    is_live: false,
  },
  email: {
    app_password: process.env.APP_PASSWORD,
    support_email: process.env.SUPPORT_EMAIL,
  },
  redis_url: process.env.REDIS_URL || 'redis://localhost:6379',
};
