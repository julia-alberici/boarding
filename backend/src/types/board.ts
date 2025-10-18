import { User } from './user';
import { List } from './list';

export interface CreateBoardInput {
    title: string;
    description?: string;
}

export interface UpdateBoardInput {
    title?: string;
    description?: string;
}

export interface Board {
    id: string;
    title: string;
    description?: string;
    userId: string;
    user?: User;
    lists?: List[];
    createdAt: Date;
    updatedAt: Date;
}