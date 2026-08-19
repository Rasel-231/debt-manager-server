import { IAuthUser } from '../../../middlewares/auth';
import { IGenericResponse } from '../../../interfaces/common';
import type { ICreateLoanPayload, ILoanFilters, IUpdateLoanPayload } from './loan.interface';
export declare const LoanService: {
    createLoan: (payload: ICreateLoanPayload, authUser: IAuthUser) => Promise<unknown>;
    getAllLoans: (filters: ILoanFilters, paginationOptions: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }, authUser: IAuthUser) => Promise<IGenericResponse<unknown>>;
    getLoanById: (id: string, authUser: IAuthUser) => Promise<unknown>;
    updateLoan: (id: string, payload: IUpdateLoanPayload, authUser: IAuthUser) => Promise<unknown>;
    deleteLoan: (id: string, authUser: IAuthUser) => Promise<void>;
    getSummary: (authUser: IAuthUser) => Promise<unknown>;
    refreshLoanStatuses: (userId?: string) => Promise<void>;
};
//# sourceMappingURL=loan.service.d.ts.map