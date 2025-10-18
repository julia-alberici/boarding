import { Board } from './board';
import { Task } from './task';

export interface List {
    id: string;
    title: string;
    position: number;
    boardId: string;
    board?: Board;
    tasks?: Task[];
}

export interface CreateListInput {
    title: string;
    position: number;
    boardId: string;
}

export interface UpdateListInput {
    title?: string;
    position?: number;
}