import { create } from 'zustand';
import type { Task, PriorityType } from '../types';
import api from '../services/api';

interface TaskState {
    tasks: Record<string, Task[]>;
    isLoading: boolean;
    error: string | null;
    fetchTasks: (listId: string) => Promise<Task[]>;
    createTask: (listId: string, title: string, description?: string, priority?: PriorityType) => Promise<Task>;
    updateTask: (task: Task, data: Partial<Task>) => Promise<void>;
    deleteTask: (task: Task) => Promise<void>;
    moveTask: (id: string, newPosition: number, currentListId: string, listId: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
    tasks: {},
    isLoading: false,
    error: null,

    fetchTasks: async (listId: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/api/tasks`, { params: { listId } });

            set(state => ({
                tasks: {
                    ...state.tasks,
                    [listId]: response.data
                },
                isLoading: false
            }));

            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error fetching tasks',
                isLoading: false
            });
            throw error;
        }
    },

    createTask: async (listId: string, title: string, description?: string, priority: PriorityType = 'MEDIUM') => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/api/tasks', {
                title,
                description,
                priority,
                listId
            });

            set(state => ({
                tasks: {
                    ...state.tasks,
                    [listId]: [...(state.tasks[listId] || []), response.data]
                },
                isLoading: false
            }));
            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error creating task',
                isLoading: false
            });
            throw error;
        }
    },

    updateTask: async (task: Task, data: Partial<Task>) => {
        try {
            set({ isLoading: true, error: null });

            const response = await api.put(`/api/tasks/${task.id}`, data);

            set(state => {
                return {
                    tasks: {
                        ...state.tasks,
                        [task.listId]: state.tasks[task.listId]?.map(t =>
                            t.id === task.id ? { ...t, ...response.data } : t
                        ) || []
                    },
                    isLoading: false
                };
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error updating task',
                isLoading: false
            });
            throw error;
        }
    },

    deleteTask: async (task: Task) => {
        try {
            set({ isLoading: true, error: null });

            await api.delete(`/api/tasks/${task.id}`);

            set(state => ({
                tasks: {
                    ...state.tasks,
                    [task.listId]: state.tasks[task.listId]?.filter(t => t.id !== task.id) || []
                },
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error deleting task',
                isLoading: false
            });
            throw error;
        }
    },

    moveTask: async (id: string, newPosition: number, currentListId: string, newListId: string) => {
        try {
            set({ isLoading: true, error: null });

            await api.patch(`/api/tasks/${id}/position`, {
                position: newPosition,
                listId: newListId
            });
            // If moving within the same list
            if (currentListId === newListId) {
                const dataNewList = await api.get(`/api/tasks`, { params: { listId: newListId } });
                set(state => {
                    return {
                        tasks: {
                            ...state.tasks,
                            [newListId]: dataNewList?.data || [],
                        },
                        isLoading: false
                    };
                });
            }else {
                const data = await api.get(`/api/tasks`, { params: { listId: currentListId } });
                const dataNewList = await api.get(`/api/tasks`, { params: { listId: newListId } });
                set(state => {
                    return {
                        tasks: {
                            ...state.tasks,
                            [newListId]: dataNewList?.data || [],
                            [currentListId]: data.data || []
                        },
                        isLoading: false
                    };
                }); 
            }

        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Error moving task',
                isLoading: false
            });
            throw error;
        }
    },
}));