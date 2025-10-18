import { Request, Response } from 'express';
import { BoardService } from '../services/board.service';
import { NotFoundError, UnauthorizedError } from '../types/errors';

const boardService = new BoardService();

export class BoardController {
    async createBoard(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            const board = await boardService.createBoard({ ...req.body, userId });
            res.status(201).json(board);
        } catch (error) {
            console.error('Error creating board:', error);
            res.status(500).json({ error: 'Failed to create board' });
        }
    }

    async getAllBoards(req: Request, res: Response) {
        try {
            const userId = req.userId!;
            const boards = await boardService.getAllBoards(userId);
            res.json(boards);
        } catch (error) {
            console.error('Error getting boards:', error);
            res.status(500).json({ error: 'Failed to get boards' });
        }
    }

    async getBoardById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId!;
            const board = await boardService.getBoardById(id, userId);
            res.json(board);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else if (error instanceof UnauthorizedError) {
                res.status(403).json({ error: error.message });
            } else {
                console.error('Error getting board:', error);
                res.status(500).json({ error: 'Failed to get board' });
            }
        }
    }

    async updateBoard(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId!;
            const board = await boardService.updateBoard(id, userId, req.body);
            res.json(board);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else if (error instanceof UnauthorizedError) {
                res.status(403).json({ error: error.message });
            } else {
                console.error('Error updating board:', error);
                res.status(500).json({ error: 'Failed to update board' });
            }
        }
    }

    async deleteBoard(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.userId!;
            await boardService.deleteBoard(id, userId);
            res.status(204).send();
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else if (error instanceof UnauthorizedError) {
                res.status(403).json({ error: error.message });
            } else {
                console.error('Error deleting board:', error);
                res.status(500).json({ error: 'Failed to delete board' });
            }
        }
    }
}
