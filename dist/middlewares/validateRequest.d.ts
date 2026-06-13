import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';
export declare const validateRequest: (schema: AnyZodObject | ZodEffects<AnyZodObject>) => (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validateRequest.d.ts.map