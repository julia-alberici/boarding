import { create } from 'zustand';
import { AuthErrorCode, type User } from '../types';
import api from '../services/api';

interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    loginError: string | null;
    registerError: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    resetError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isLoading: false,
    loginError: null,
    registerError: null,

    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, loginError: null });
            const response = await api.post('/api/auth/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({ token, user, isLoading: false });
        } catch (error: any) {
            let errorMessage = 'Erro ao fazer login';
            if (error.response.data.code === AuthErrorCode.INVALID_CREDENTIALS) {
                errorMessage = 'Email ou senha incorretos.';
            } else if (error.response.data.code === AuthErrorCode.MISSING_FIELDS) {
                errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
            }
            set({
                loginError: errorMessage,
                isLoading: false
            });
            throw error;
        }
    },

    register: async (name: string, email: string, password: string) => {
        try {
            set({ isLoading: true, registerError: null });

            const response = await api.post('/api/auth/register', { name, email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            set({ token, user, isLoading: false });
        } catch (error: any) {
            const errorCode = error?.response?.data?.code;

            const errorMessages: Record<string, string> = {
                [AuthErrorCode.MISSING_FIELDS]: 'Por favor, preencha todos os campos obrigatórios.',
                [AuthErrorCode.PASSWORD_TOO_SHORT]: 'A senha deve ter pelo menos 8 caracteres.',
                [AuthErrorCode.INVALID_EMAIL]: 'Por favor, insira um email válido.',
                [AuthErrorCode.USER_ALREADY_EXISTS]: 'Uma conta com este email já existe.',
            };

            const errorMessage = errorMessages[errorCode] || 'Erro ao criar conta. Tente novamente.';

            set({ registerError: errorMessage, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null });
    },

    resetError: () => {
        set({ loginError: null });
    },
}));