import { IGenericResponse } from '../../../interfaces/common';
import type { IUpdateUserPayload, IUserFilters } from './user.interface';
export declare const UserService: {
    getAllUsers: (filters: IUserFilters, paginationOptions: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }) => Promise<IGenericResponse<unknown>>;
    getUserById: (id: string) => Promise<unknown>;
    updateUser: (id: string, payload: IUpdateUserPayload) => Promise<unknown>;
    deleteUser: (id: string) => Promise<void>;
};
//# sourceMappingURL=user.service.d.ts.map