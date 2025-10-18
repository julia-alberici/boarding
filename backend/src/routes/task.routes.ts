import { Router } from 'express';
import { body, query } from 'express-validator';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware as validate } from '../middleware/validation.middleware';

const router = Router();
const taskController = new TaskController();

// Validation schemas
const createTaskSchema = [
    body('title').notEmpty().trim().withMessage('Title is required'),
    body('description').optional().trim(),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
    body('listId').notEmpty().withMessage('List ID is required'),
    body('assignedId').optional().isUUID().withMessage('Invalid user ID'),
];

const updateTaskSchema = [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Invalid priority'),
    body('assignedId').optional().isUUID().withMessage('Invalid user ID'),
];

const updatePositionSchema = [
    body('position').isInt({ min: 0 }).withMessage('Position must be a non-negative integer'),
    body('listId').notEmpty().withMessage('List ID is required'),
];

// Routes
router.use(authMiddleware);

router.post('/', createTaskSchema, validate, taskController.createTask);
router.get('/', query('listId').notEmpty().withMessage('List ID is required'), validate, taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', updateTaskSchema, validate, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/position', updatePositionSchema, validate, taskController.updateTaskPosition);

export default router;
