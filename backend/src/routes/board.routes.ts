import { Router } from 'express';
import { BoardController } from '../controllers/board.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { body, param } from 'express-validator';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();
const boardController = new BoardController();

router.use(authMiddleware);

router.post('/',
    [
        body('title').notEmpty().trim().withMessage('Título é obrigatório'),
        body('description').optional().trim(),
        validationMiddleware
    ],
    boardController.createBoard.bind(boardController)
);

router.get('/',
    boardController.getAllBoards.bind(boardController)
);

router.get('/:id',
    [
        param('id').isUUID().withMessage('Invalid board ID'),
        validationMiddleware
    ],
    boardController.getBoardById.bind(boardController)
);

router.put('/:id',
    [
        param('id').isUUID().withMessage('Invalid board ID'),
        body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
        body('description').optional().trim(),
        validationMiddleware
    ],
    boardController.updateBoard.bind(boardController)
);

router.delete('/:id',
    [
        param('id').isUUID().withMessage('Invalid board ID'),
        validationMiddleware
    ],
    boardController.deleteBoard.bind(boardController)
);

export default router;
