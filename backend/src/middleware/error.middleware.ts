import { Request, Response, NextFunction } from 'express';
import { ErrorResponse, GeneralErrorCode } from '../types/errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    const response: ErrorResponse = {
        code: GeneralErrorCode.INTERNAL_SERVER_ERROR
    };

    if (process.env.NODE_ENV === 'development') {
        response.details = { stack: err.stack };
    }   

    res.status(statusCode).json(response);
};

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.status(404).json({
        code: GeneralErrorCode.ROUTE_NOT_FOUND,
        details: { path: req.originalUrl }
    });
};