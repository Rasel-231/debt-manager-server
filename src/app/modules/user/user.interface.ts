export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserFilters {
  searchTerm?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}
