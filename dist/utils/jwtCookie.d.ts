import { Response } from 'express';
export interface IAuthTokens {
    accessToken: string;
    refreshToken: string;
}
export declare const setAuthCookies: (res: Response, tokens: IAuthTokens) => void;
export declare const clearAuthCookies: (res: Response) => void;
//# sourceMappingURL=jwtCookie.d.ts.map