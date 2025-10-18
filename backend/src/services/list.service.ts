import { PrismaClient } from '@prisma/client';
import { CreateListInput, UpdateListInput } from '../types/list';
import { NotFoundError } from '../types/errors';

const prisma = new PrismaClient();

export class ListService {
    async createList(data: CreateListInput) {
        return prisma.list.create({
            data,
            include: { tasks: true }
        });
    }

    async updateList(id: string, data: UpdateListInput) {
        return prisma.list.update({
            where: { id },
            data,
            include: { tasks: true }
        });
    }

    async deleteList(id: string) {
        return prisma.list.delete({ where: { id } });
    }

    async getListById(id: string) {
        const list = await prisma.list.findUnique({
            where: { id },
            include: { tasks: true }
        });

        if (!list) throw new NotFoundError('List not found');
        return list;
    }

    async getListsByBoardId(boardId: string) {
        return prisma.list.findMany({
            where: { boardId },
            include: { tasks: true },
            orderBy: { position: 'asc' }
        });
    }
}