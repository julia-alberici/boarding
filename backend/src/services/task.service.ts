import { PrismaClient, Task, Priority } from '@prisma/client';
import { ApiError } from '../types/errors';

const prisma = new PrismaClient();

interface CreateTaskDto {
    title: string;
    description?: string;
    priority?: Priority;
    listId: string;
    assignedId?: string;
}

interface UpdateTaskDto {
    title?: string;
    description?: string;
    priority?: Priority;
    assignedId?: string;
}

export class TaskService {
    async createTask(data: CreateTaskDto): Promise<Task> {
        // Get the highest position in the list
        const highestPosition = await prisma.task.findFirst({
            where: { listId: data.listId },
            orderBy: { position: 'desc' },
            select: { position: true },
        });

        const position = (highestPosition?.position ?? -1) + 1;

        return prisma.task.create({
            data: {
                ...data,
                position,
            },
        });
    }

    async getTasks(listId: string): Promise<Task[]> {
        return prisma.task.findMany({
            where: { listId },
            orderBy: { position: 'asc' },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getTaskById(id: string): Promise<Task | null> {
        return prisma.task.findUnique({
            where: { id },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            throw new ApiError('Task not found', 404);
        }

        return prisma.task.update({
            where: { id },
            data,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async deleteTask(id: string): Promise<void> {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            throw new ApiError('Task not found', 404);
        }

        await prisma.task.delete({ where: { id } });
    }

    async updateTaskPosition(id: string, newPosition: number, listId: string): Promise<Task> {
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            throw new ApiError('Task not found', 404);
        }

        // Get all tasks in the list
        const tasks = await prisma.task.findMany({
            where: { listId },
            orderBy: { position: 'asc' },
        });

        // Reorder tasks
        const updatedTasks = tasks.filter(t => t.id !== id);
        updatedTasks.splice(newPosition, 0, task);

        // Update positions in transaction
        await prisma.$transaction(
            updatedTasks.map((task, index) =>
                prisma.task.update({
                    where: { id: task.id },
                    data: { position: index, listId },
                })
            )
        );

        return prisma.task.findUnique({
            where: { id },
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }) as Promise<Task>;
    }
}
