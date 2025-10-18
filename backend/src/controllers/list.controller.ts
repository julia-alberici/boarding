import { Request, Response } from 'express';
import { ListService } from '../services/list.service';
import { NotFoundError } from '../types/errors';

const listService = new ListService();

export class ListController {
    async createList(req: Request, res: Response) {
        try {
            const list = await listService.createList(req.body);
            res.status(201).json(list);
        } catch (error) {
            console.error('Error creating list:', error);
            res.status(500).json({ error: 'Failed to create list' });
        }
    }

    async updateList(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const list = await listService.updateList(id, req.body);
            res.json(list);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else {
                console.error('Error updating list:', error);
                res.status(500).json({ error: 'Failed to update list' });
            }
        }
    }

    async deleteList(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await listService.deleteList(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting list:', error);
            res.status(500).json({ error: 'Failed to delete list' });
        }
    }

    async getListsByBoardId(req: Request, res: Response) {
        try {
            const { boardId } = req.params;
            const lists = await listService.getListsByBoardId(boardId);
            res.json(lists);
        } catch (error) {
            console.error('Error getting lists:', error);
            res.status(500).json({ error: 'Failed to get lists' });
        }
    }
    async getListById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const list = await listService.getListById(id);
            res.json(list);
        } catch (error) {
            console.error('Error getting list:', error);
            res.status(500).json({ error: 'Failed to get list' });
        }
    }
}