import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { ApiError } from '../types/errors';

const taskService = new TaskService();

export class TaskController {
    async createTask(req: Request, res: Response, next: NextFunction) {
        try {
            const task = await taskService.createTask(req.body);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async getTasks(req: Request, res: Response, next: NextFunction) {
        try {
            const { listId } = req.query;

            if (!listId || typeof listId !== 'string') {
                throw new ApiError('List ID is required', 400);
            }

            const tasks = await taskService.getTasks(listId);
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const task = await taskService.getTaskById(id);

            if (!task) {
                throw new ApiError('Task not found', 404);
            }

            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const task = await taskService.updateTask(id, req.body);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await taskService.deleteTask(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async updateTaskPosition(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { position, listId } = req.body;

            if (typeof position !== 'number' || !listId) {
                throw new ApiError('Invalid position or listId', 400);
            }

            const task = await taskService.updateTaskPosition(id, position, listId);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }
}
