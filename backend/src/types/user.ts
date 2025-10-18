import { Board } from './board';
import { Task } from './task';

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    boards?: Board[];
    tasks?: Task[];
    createdAt: Date;
}