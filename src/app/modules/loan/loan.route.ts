import express from 'express';
import { validateRequest } from '../../../middlewares/validateRequest';
import { authenticate } from '../../../middlewares/auth';
import { LoanController } from './loan.controller';
import { loanValidation } from './loan.validation';

const router = express.Router();

router.get('/summary', authenticate, LoanController.getSummary);
router.get('/', authenticate, LoanController.getAllLoans);
router.post(
  '/',
  authenticate,
  validateRequest(loanValidation.createLoanSchema),
  LoanController.createLoan
);
router.get('/:id', authenticate, LoanController.getLoanById);
router.patch(
  '/:id',
  authenticate,
  validateRequest(loanValidation.updateLoanSchema),
  LoanController.updateLoan
);
router.delete('/:id', authenticate, LoanController.deleteLoan);

export const LoanRoutes = router;
