import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthErrorCode, GeneralErrorCode } from '../types/errors';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, name } = req.body;

            if (!email || !password || !name) {
                res.status(400).json({ code: AuthErrorCode.MISSING_FIELDS });
                return;
            }

            //TODO melhorar validação
            if (password.length < 8) {
                res.status(400).json({ code: AuthErrorCode.PASSWORD_TOO_SHORT });
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400).json({ code: AuthErrorCode.INVALID_EMAIL });
                return;
            }

            const result = await this.authService.register(email, password, name);

            if (!result) {
                res.status(409).json({ code: AuthErrorCode.USER_ALREADY_EXISTS });
                return;
            }

            res.status(201).json({
                token: result.token,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name
                }
            });
        } catch (error: any) {
            console.error('Register error:', error);
            res.status(500).json({ code: GeneralErrorCode.INTERNAL_SERVER_ERROR });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ code: AuthErrorCode.MISSING_FIELDS });
                return;
            }

            const result = await this.authService.login(email, password);

            if (!result) {
                res.status(401).json({ code: AuthErrorCode.INVALID_CREDENTIALS });
                return;
            }

            res.status(200).json({
                token: result.token,
                user: {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name
                }
            });
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(500).json({ code: GeneralErrorCode.INTERNAL_SERVER_ERROR });
        }
    };

    me = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).userId;

            const user = await this.authService.getUserById(userId);

            if (!user) {
                res.status(404).json({ code: AuthErrorCode.USER_NOT_FOUND });
                return;
            }

            res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt
                }
            });
        } catch (error: any) {
            console.error('Get user error:', error);
            res.status(500).json({ code: GeneralErrorCode.INTERNAL_SERVER_ERROR });
        }
    };
}