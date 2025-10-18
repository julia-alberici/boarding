import { useState } from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../UI/dialog';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../UI/alert';
import { Label } from './label';
import type { Board } from '../../types';

interface CreateBoardModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: ( title: string, description?: string, id?: string) => Promise<void>;
    isLoading?: boolean;
    board?: Board;
}

export const CreateBoardModal = ({ board, open, onClose, onSubmit, isLoading }: CreateBoardModalProps) => {
    const [title, setTitle] = useState(board?.title || '');
    const [description, setDescription] = useState(board?.description || '');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');

        if (!title.trim()) {
            setError('O título é obrigatório');
            return;
        }

        try {
            await onSubmit(title.trim(), description.trim(), board?.id);
            setTitle('');
            setDescription('');
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.code || !board ? 'Erro ao criar quadro' : 'Erro ao atualizar quadro');
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen && !isLoading) {
            setTitle('');
            setDescription('');
            setError('');
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-neutral-900 border-red-900 text-white">
                <DialogHeader>
                    {board ? (
                        <DialogTitle className="text-white">Editar Quadro</DialogTitle>
                    ) : (
                        <>
                            <DialogTitle className="text-white">Novo Quadro</DialogTitle>
                            <DialogDescription className="text-neutral-400">
                                Crie um novo quadro para organizar suas tarefas
                            </DialogDescription>
                        </>
                    )}
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {error && (
                        <Alert variant="destructive" className="bg-red-950 border-red-800">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                            <AlertDescription className="text-red-200">{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-neutral-200">
                            Título <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Nome do quadro"
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-neutral-200">Descrição (opcional)</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Descrição do quadro"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading || !title.trim()}
                        isLoading={isLoading}
                    >
                        {board ? 'Salvar': 'Criar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};