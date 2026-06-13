import { IPaginationOptions } from '../interfaces/common';
export declare const paginationHelper: {
    calculatePagination(options: IPaginationOptions): {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: "asc" | "desc";
    };
};
//# sourceMappingURL=paginationHelper.d.ts.map