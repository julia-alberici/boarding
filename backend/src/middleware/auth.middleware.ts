import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthErrorCode, GeneralErrorCode } from '../types/errors';

interface JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ code: AuthErrorCode.NO_TOKEN });
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ code: AuthErrorCode.NO_TOKEN });
            return;
        }

        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
            req.userId = decoded.userId;
            next();
        } catch (error: any) {
            const code = error.name === 'TokenExpiredError'
                ? AuthErrorCode.EXPIRED_TOKEN
                : AuthErrorCode.INVALID_TOKEN;

            res.status(401).json({ code });
            return;
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ code: GeneralErrorCode.INTERNAL_SERVER_ERROR });
    }
};