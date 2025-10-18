import { useState } from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import type { Board } from '../../types';

interface EditBoardModalProps {
    board: Board;
    onClose: () => void;
    onSubmit: (id: string, title: string, description?: string) => Promise<void>;
    isLoading?: boolean;
}

export const EditBoardModal = ({ board, onClose, onSubmit, isLoading }: EditBoardModalProps) => {
    const [title, setTitle] = useState(board.title);
    const [description, setDescription] = useState(board.description || '');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('O título é obrigatório');
            return;
        }

        try {
            await onSubmit(board.id, title.trim(), description.trim());
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.code || 'Erro ao atualizar quadro');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <h2 className="text-2xl font-bold text-[#F5F5F5]">
                        Editar Quadro
                    </h2>

                    <Input
                        label="Título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Nome do quadro"
                        error={error}
                        required
                        autoFocus
                    />

                    <Input
                        label="Descrição (opcional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrição do quadro"
                    />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            isLoading={isLoading}
                        >
                            Salvar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};