import { Response } from 'express';
interface ISendResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}
export declare const sendResponse: <T>(res: Response, payload: ISendResponse<T>) => void;
export {};
//# sourceMappingURL=sendResponse.d.ts.map