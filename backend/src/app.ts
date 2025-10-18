import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import boardRoutes from './routes/board.routes';
import authRoutes from './routes/auth.routes';
import listRoutes from './routes/list.routes';
import taskRoutes from './routes/task.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tasks', taskRoutes);

export default app;
