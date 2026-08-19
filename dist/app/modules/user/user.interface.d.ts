export interface IUserFilters {
    searchTerm?: string;
    email?: string;
    role?: 'USER' | 'ADMIN';
    isActive?: string;
}
export interface IUpdateUserPayload {
    name?: string;
    role?: 'USER' | 'ADMIN';
    isActive?: boolean;
    password?: string;
}
//# sourceMappingURL=user.interface.d.ts.map