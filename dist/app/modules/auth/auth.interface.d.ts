import { IAuthUser } from '../../../middlewares/auth';
export type AuthRole = IAuthUser['role'];
export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
}
export interface ILoginPayload {
    email: string;
    password: string;
}
export interface IChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}
export interface ISafeUser {
    id: string;
    name: string;
    email: string;
    role: AuthRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    user: ISafeUser;
}
export interface ITokenPayload extends IAuthUser {
}
//# sourceMappingURL=auth.interface.d.ts.map