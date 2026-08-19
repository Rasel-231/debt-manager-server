"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../../middlewares/validateRequest");
const auth_1 = require("../../../middlewares/auth");
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.validateRequest)(auth_validation_1.authValidation.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validateRequest_1.validateRequest)(auth_validation_1.authValidation.loginSchema), auth_controller_1.AuthController.login);
router.post('/logout', auth_1.authenticate, auth_controller_1.AuthController.logout);
router.post('/refresh', (0, validateRequest_1.validateRequest)(auth_validation_1.authValidation.refreshTokenSchema), auth_controller_1.AuthController.refreshToken);
router.get('/me', auth_1.authenticate, auth_controller_1.AuthController.getMe);
router.post('/change-password', auth_1.authenticate, (0, validateRequest_1.validateRequest)(auth_validation_1.authValidation.changePasswordSchema), auth_controller_1.AuthController.changePassword);
exports.AuthRoutes = router;
//# sourceMappingURL=auth.route.js.map