"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../../middlewares/validateRequest");
const auth_1 = require("../../../middlewares/auth");
const loan_controller_1 = require("./loan.controller");
const loan_validation_1 = require("./loan.validation");
const router = express_1.default.Router();
router.get('/summary', auth_1.authenticate, loan_controller_1.LoanController.getSummary);
router.get('/', auth_1.authenticate, loan_controller_1.LoanController.getAllLoans);
router.post('/', auth_1.authenticate, (0, validateRequest_1.validateRequest)(loan_validation_1.loanValidation.createLoanSchema), loan_controller_1.LoanController.createLoan);
router.get('/:id', auth_1.authenticate, loan_controller_1.LoanController.getLoanById);
router.patch('/:id', auth_1.authenticate, (0, validateRequest_1.validateRequest)(loan_validation_1.loanValidation.updateLoanSchema), loan_controller_1.LoanController.updateLoan);
router.delete('/:id', auth_1.authenticate, loan_controller_1.LoanController.deleteLoan);
exports.LoanRoutes = router;
//# sourceMappingURL=loan.route.js.map