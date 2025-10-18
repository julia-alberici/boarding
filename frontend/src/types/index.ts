export type User = {
    id: string;
    name: string;
    email: string;
};

export type PriorityType = 'LOW' | 'MEDIUM' | 'HIGH';

export type Task = {
    id: string;
    title: string;
    description?: string;
    priority: PriorityType;
    position: number;
    listId: string;
    assignedId?: string;
    createdAt: string;
    updatedAt: string;
};

export type List = {
    id: string;
    title: string;
    position: number;
    boardId: string;
    tasks: Task[];
};

export type Board = {
    id: string;
    title: string;
    description?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

export * from './errors';
