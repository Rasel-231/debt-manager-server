import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: 'src/app/prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
