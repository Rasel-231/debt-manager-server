export interface ITransactionFilters {
    searchTerm?: string;
    loanId?: string;
    type?: 'DEPOSIT' | 'PAYMENT';
    fromDate?: string;
    toDate?: string;
}
export interface ICreateTransactionPayload {
    loanId: string;
    amountPaid: number;
    type: 'DEPOSIT' | 'PAYMENT';
    paymentDate?: string | null;
    notes?: string | null;
}
export interface IUpdateTransactionPayload {
    amountPaid?: number;
    type?: 'DEPOSIT' | 'PAYMENT';
    paymentDate?: string | null;
    notes?: string | null;
}
//# sourceMappingURL=transaction.interface.d.ts.map