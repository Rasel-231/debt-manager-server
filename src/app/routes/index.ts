import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { LoanRoutes } from '../modules/loan/loan.route';
import { TransactionRoutes } from '../modules/transaction/transaction.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: AuthRoutes },
  { path: '/users', route: UserRoutes },
  { path: '/loans', route: LoanRoutes },
  { path: '/transactions', route: TransactionRoutes },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));

export default router;
