import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
    private readonly JWT_SECRET: string;
    private readonly JWT_EXPIRES_IN: string;
    private readonly SALT_ROUNDS: number;

    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1D';
        this.SALT_ROUNDS = 10;
    }

    async register(email: string, password: string, name: string) {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return null;
        }

        const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        const token = this.generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        };
    }

    async login(email: string, password: string) {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return null;
        }

        const token = this.generateToken(user.id);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        };
    }

    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt
        };
    }

    private generateToken(userId: string): string {
        return jwt.sign({ userId }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN as any });
    }

    verifyToken(token: string): { userId: string; } {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; };
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}