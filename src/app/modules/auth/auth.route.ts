import express from 'express';
import { validateRequest } from '../../../middlewares/validateRequest';
import { authenticate } from '../../../middlewares/auth';
import { AuthController } from './auth.controller';
import { authValidation } from './auth.validation';

const router = express.Router();

router.post('/register', validateRequest(authValidation.registerSchema), AuthController.register);
router.post('/login', validateRequest(authValidation.loginSchema), AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.post(
  '/refresh',
  validateRequest(authValidation.refreshTokenSchema),
  AuthController.refreshToken
);
router.get('/me', authenticate, AuthController.getMe);
router.post(
  '/change-password',
  authenticate,
  validateRequest(authValidation.changePasswordSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
