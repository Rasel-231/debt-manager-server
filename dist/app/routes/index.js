"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const loan_route_1 = require("../modules/loan/loan.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: '/auth', route: auth_route_1.AuthRoutes },
    { path: '/users', route: user_route_1.UserRoutes },
    { path: '/loans', route: loan_route_1.LoanRoutes },
    { path: '/transactions', route: transaction_route_1.TransactionRoutes },
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
exports.default = router;
//# sourceMappingURL=index.js.map