import { create } from 'zustand';
import type { List } from '../types';
import api from '../services/api';

interface ListState {
    lists: Record<string, List[]>;
    isLoading: boolean;
    error: string | null;
    createList: (boardId: string, title: string) => Promise<List>;
    updateList: (id: string, title: string) => Promise<List>;
    deleteList: (id: string) => Promise<void>;
    fetchListsByBoardId: (boardId: string) => Promise<List[]>;
    moveList: (id: string, newPosition: number) => Promise<List>;
}

export const useListStore = create<ListState>((set) => ({
    lists: {},
    isLoading: false,
    error: null,

    fetchListsByBoardId: async (boardId: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/api/lists/board/${boardId}`);

            set(state => ({
                lists: {
                    ...state.lists,
                    [boardId]: response.data
                },
                isLoading: false
            }));

            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao carregar listas',
                isLoading: false
            });
            throw error;
        }
    },

    createList: async (boardId: string, title: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/api/lists', { boardId, title });

            set(state => ({
                lists: {
                    ...state.lists,
                    [boardId]: [...(state.lists[boardId] || []), response.data]
                },
                isLoading: false
            }));

            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao criar lista',
                isLoading: false
            });
            throw error;
        }
    },

    updateList: async (id: string, title: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.put(`/api/lists/${id}`, { title });

            set(state => {
                const boardId = response.data.boardId;
                return {
                    lists: {
                        ...state.lists,
                        [boardId]: state.lists[boardId].map(list =>
                            list.id === id ? { ...list, ...response.data } : list
                        )
                    },
                    isLoading: false
                };
            });

            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao atualizar lista',
                isLoading: false
            });
            throw error;
        }
    },

    deleteList: async (id: string) => {
        try {
            set({ isLoading: true, error: null });

            // First get the list to know its boardId
            const listResponse = await api.get(`/api/lists/${id}`);
            const boardId = listResponse.data.boardId;

            await api.delete(`/api/lists/${id}`);

            set(state => ({
                lists: {
                    ...state.lists,
                    [boardId]: state.lists[boardId].filter(list => list.id !== id)
                },
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao deletar lista',
                isLoading: false
            });
            throw error;
        }
    },

    moveList: async (id: string, newPosition: number) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.patch(`/api/lists/${id}/position`, {
                position: newPosition
            });

            set(state => {
                const boardId = response.data.boardId;
                return {
                    lists: {
                        ...state.lists,
                        [boardId]: response.data
                    },
                    isLoading: false
                };
            });

            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao mover lista',
                isLoading: false
            });
            throw error;
        }
    }
}));