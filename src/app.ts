import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import router from './app/routes';

const app: Application = express();

app.use(
  cors({
    origin: [config.frontend_url],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is running' });
});
app.use('/api/v1', router);

app.use(globalErrorHandler);

export default app;
