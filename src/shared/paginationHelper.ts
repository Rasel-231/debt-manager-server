import { IPaginationOptions } from '../interfaces/common';

export const paginationHelper = {
  calculatePagination(options: IPaginationOptions) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 10));
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    return { page, limit, skip, sortBy, sortOrder };
  },
};
