import { Router } from 'express';
import { ListController } from '../controllers/list.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const listController = new ListController();

router.use(authMiddleware);

router.post('/', listController.createList.bind(listController));
router.put('/:id', listController.updateList.bind(listController));
router.delete('/:id', listController.deleteList.bind(listController));
router.get('/board/:boardId', listController.getListsByBoardId.bind(listController));
router.get('/:id', listController.getListById.bind(listController));

export default router;