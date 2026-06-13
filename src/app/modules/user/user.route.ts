import express from 'express';
import { UserController } from './user.controller';
import { fileUploadHelper } from '../../../utils/fileUploadHelper';

const router = express.Router();

router.post(
  '/register-profile',
  fileUploadHelper.upload.single('image'),
  UserController.createUserAccount
);

export const UserRoutes = router;
