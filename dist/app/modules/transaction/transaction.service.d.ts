import { IAuthUser } from '../../../middlewares/auth';
import { IGenericResponse } from '../../../interfaces/common';
import type { ICreateTransactionPayload, ITransactionFilters, IUpdateTransactionPayload } from './transaction.interface';
export declare const TransactionService: {
    createTransaction: (payload: ICreateTransactionPayload, authUser: IAuthUser) => Promise<unknown>;
    getAllTransactions: (filters: ITransactionFilters, paginationOptions: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }, authUser: IAuthUser) => Promise<IGenericResponse<unknown>>;
    getTransactionById: (id: string, authUser: IAuthUser) => Promise<unknown>;
    updateTransaction: (id: string, payload: IUpdateTransactionPayload, authUser: IAuthUser) => Promise<unknown>;
    deleteTransaction: (id: string, authUser: IAuthUser) => Promise<void>;
    getStats: (authUser: IAuthUser) => Promise<unknown>;
};
//# sourceMappingURL=transaction.service.d.ts.map