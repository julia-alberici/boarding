import { PrismaClient } from '@prisma/client';
import { CreateBoardInput, UpdateBoardInput } from '../types/board';
import { NotFoundError, UnauthorizedError } from '../types/errors';

const prisma = new PrismaClient();

export class BoardService {
    async createBoard(data: CreateBoardInput & { userId: string; }) {
        return prisma.board.create({
            data: {
                title: data.title,
                description: data.description,
                userId: data.userId,
                lists: {
                    create: [
                        { title: 'To Do', position: 0 },
                        { title: 'In Progress', position: 1 },
                        { title: 'Done', position: 2 }
                    ]
                }
            },
            include: {
                lists: true
            }
        });
    }

    async getAllBoards(userId: string) {
        return prisma.board.findMany({
            where: { userId },
            include: {
                lists: {
                    include: {
                        tasks: true
                    }
                }
            }
        });
    }

    async getBoardById(id: string, userId: string) {
        const board = await prisma.board.findUnique({
            where: { id },
            include: {
                lists: {
                    include: {
                        tasks: true
                    }
                }
            }
        });

        if (!board) {
            throw new NotFoundError('Board not found');
        }

        if (board.userId !== userId) {
            throw new UnauthorizedError('You do not have access to this board');
        }

        return board;
    }

    async updateBoard(id: string, userId: string, data: UpdateBoardInput) {
        const board = await this.getBoardById(id, userId);

        return prisma.board.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description
            },
            include: {
                lists: true
            }
        });
    }

    async deleteBoard(id: string, userId: string) {
        const board = await this.getBoardById(id, userId);

        return prisma.$transaction([
            prisma.task.deleteMany({
                where: {
                    list: {
                        boardId: id
                    }
                }
            }),
            prisma.list.deleteMany({
                where: { boardId: id }
            }),
            prisma.board.delete({
                where: { id }
            })
        ]);
    }
}
