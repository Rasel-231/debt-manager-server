"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../../middlewares/validateRequest");
const auth_1 = require("../../../middlewares/auth");
const transaction_controller_1 = require("./transaction.controller");
const transaction_validation_1 = require("./transaction.validation");
const router = express_1.default.Router();
router.get('/stats', auth_1.authenticate, transaction_controller_1.TransactionController.getStats);
router.get('/', auth_1.authenticate, transaction_controller_1.TransactionController.getAllTransactions);
router.post('/', auth_1.authenticate, (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionValidation.createTransactionSchema), transaction_controller_1.TransactionController.createTransaction);
router.get('/:id', auth_1.authenticate, transaction_controller_1.TransactionController.getTransactionById);
router.patch('/:id', auth_1.authenticate, (0, validateRequest_1.validateRequest)(transaction_validation_1.transactionValidation.updateTransactionSchema), transaction_controller_1.TransactionController.updateTransaction);
router.delete('/:id', auth_1.authenticate, transaction_controller_1.TransactionController.deleteTransaction);
exports.TransactionRoutes = router;
//# sourceMappingURL=transaction.route.js.map