import { create } from 'zustand';
import type { Board } from '../types';
import api from '../services/api';

interface BoardState {
    boards: Board[];
    currentBoard: Board | null;
    isLoading: boolean;
    error: string | null;
    fetchBoards: () => Promise<void>;
    fetchBoardById: (id: string) => Promise<void>;
    createBoard: (title: string, description?: string) => Promise<Board>;
    updateBoard: (id: string, title: string, description?: string) => Promise<Board>;
    deleteBoard: (id: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set) => ({
    boards: [],
    currentBoard: null,
    isLoading: false,
    error: null,

    fetchBoards: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/api/boards');
            set({ boards: response.data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao carregar boards',
                isLoading: false
            });
            throw error;
        }
    },

    fetchBoardById: async (id: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/api/boards/${id}`);
            set({
                currentBoard: response.data,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao carregar board',
                isLoading: false
            });
            throw error;
        }
    },

    createBoard: async (title: string, description?: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/api/boards', { title, description });
            set((state) => ({
                boards: [...state.boards, response.data],
                isLoading: false
            }));
            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao criar board',
                isLoading: false
            });
            throw error;
        }
    },

    updateBoard: async (id: string, title: string, description?: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.put(`/api/boards/${id}`, { title, description });
            set((state) => ({
                boards: state.boards.map((board) =>
                    board.id === id ? { ...board, ...response.data } : board
                ),
                isLoading: false
            }));
            return response.data;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao atualizar board',
                isLoading: false
            });
            throw error;
        }
    },

    deleteBoard: async (id: string) => {
        try {
            set({ isLoading: true, error: null });
            await api.delete(`/api/boards/${id}`);
            set((state) => ({
                boards: state.boards.filter((board) => board.id !== id),
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Erro ao deletar board',
                isLoading: false
            });
            throw error;
        }
    }
}));