import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { GeneralErrorCode } from '../types/errors';

export function validationMiddleware(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: GeneralErrorCode.VALIDATION_ERROR,
            details: errors.array()
        });
    }
    next();
}
