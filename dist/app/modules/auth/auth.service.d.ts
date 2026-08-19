import type { IAuthResponse, IChangePasswordPayload, ILoginPayload, IRegisterPayload, ISafeUser } from './auth.interface';
export declare const AuthService: {
    register: (payload: IRegisterPayload) => Promise<IAuthResponse>;
    login: (payload: ILoginPayload) => Promise<IAuthResponse>;
    logout: (userId: string, token: string) => Promise<void>;
    refreshToken: (refreshToken: string) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile: (userId: string) => Promise<ISafeUser>;
    changePassword: (userId: string, payload: IChangePasswordPayload) => Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map