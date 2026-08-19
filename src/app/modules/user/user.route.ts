import express from 'express';
import { validateRequest } from '../../../middlewares/validateRequest';
import { authenticate, authorize } from '../../../middlewares/auth';
import { UserController } from './user.controller';
import { userValidation } from './user.validation';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), UserController.getAllUsers);
router.get('/:id', authenticate, authorize('ADMIN'), UserController.getUserById);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validateRequest(userValidation.updateUserSchema),
  UserController.updateUser
);
router.delete('/:id', authenticate, authorize('ADMIN'), UserController.deleteUser);

export const UserRoutes = router;
