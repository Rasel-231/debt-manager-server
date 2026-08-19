import { NextFunction, Request, Response } from 'express';
export interface IAuthUser {
    userId: string;
    email: string;
    role: 'USER' | 'ADMIN';
}
declare global {
    namespace Express {
        interface Request {
            user?: IAuthUser;
        }
    }
}
declare const authenticate: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
declare const authorize: (...allowedRoles: IAuthUser["role"][]) => (req: Request, _res: Response, next: NextFunction) => void;
export { authenticate, authorize };
//# sourceMappingURL=auth.d.ts.map