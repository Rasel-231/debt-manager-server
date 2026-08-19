import express from 'express';
import { validateRequest } from '../../../middlewares/validateRequest';
import { authenticate } from '../../../middlewares/auth';
import { TransactionController } from './transaction.controller';
import { transactionValidation } from './transaction.validation';

const router = express.Router();

router.get('/stats', authenticate, TransactionController.getStats);
router.get('/', authenticate, TransactionController.getAllTransactions);
router.post(
  '/',
  authenticate,
  validateRequest(transactionValidation.createTransactionSchema),
  TransactionController.createTransaction
);
router.get('/:id', authenticate, TransactionController.getTransactionById);
router.patch(
  '/:id',
  authenticate,
  validateRequest(transactionValidation.updateTransactionSchema),
  TransactionController.updateTransaction
);
router.delete('/:id', authenticate, TransactionController.deleteTransaction);

export const TransactionRoutes = router;
