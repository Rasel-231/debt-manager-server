"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationHelper = void 0;
exports.paginationHelper = {
    calculatePagination(options) {
        const page = Math.max(1, Number(options.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(options.limit) || 10));
        const skip = (page - 1) * limit;
        const sortBy = options.sortBy || 'createdAt';
        const sortOrder = options.sortOrder || 'desc';
        return { page, limit, skip, sortBy, sortOrder };
    },
};
//# sourceMappingURL=paginationHelper.js.map