"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../../middlewares/validateRequest");
const auth_1 = require("../../../middlewares/auth");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), user_controller_1.UserController.getAllUsers);
router.get('/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), user_controller_1.UserController.getUserById);
router.patch('/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), (0, validateRequest_1.validateRequest)(user_validation_1.userValidation.updateUserSchema), user_controller_1.UserController.updateUser);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('ADMIN'), user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
//# sourceMappingURL=user.route.js.map