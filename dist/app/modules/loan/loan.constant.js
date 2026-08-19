"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loanSortableFields = exports.loanFilterableFields = exports.loanSearchableFields = void 0;
exports.loanSearchableFields = ['title'];
exports.loanFilterableFields = [
    'searchTerm',
    'loanType',
    'status',
    'fromDate',
    'toDate',
    'dueFrom',
    'dueTo',
    'minAmount',
    'maxAmount',
];
exports.loanSortableFields = ['createdAt', 'amount', 'remainingAmount', 'dueDate', 'title'];
//# sourceMappingURL=loan.constant.js.map