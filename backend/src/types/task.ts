import { Priority } from './types';
import { List } from './list';
import { User } from './user';

export interface Task {
    id: string;
    title: string;
    description?: string;
    priority: Priority;
    position: number;
    listId: string;
    list?: List;
    assignedId?: string;
    assignedTo?: User;
    createdAt: Date;
    updatedAt: Date;
}