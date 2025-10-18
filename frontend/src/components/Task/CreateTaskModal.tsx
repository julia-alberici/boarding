import { useState } from 'react';
import type { PriorityType } from '../../types';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../UI/dialog';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../UI/alert';
import { Label } from '../Board/label';
import { Badge } from '../UI/badge';
import { getPriorityLabel } from '../../lib/utils';

interface CreateTaskModalProps {
    open: boolean;
    listId: string;
    onClose: () => void;
    onSubmit: (listId: string, title: string, description?: string, priority?: PriorityType) => Promise<void>;
    isLoading?: boolean;
}

export function CreateTaskModal({ listId, open, onClose, onSubmit, isLoading }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<PriorityType>('MEDIUM');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');

        if (!title.trim()) {
            setError('O título é obrigatório');
            return;
        }

        try {
            await onSubmit(listId, title.trim(), description.trim(), priority);
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao criar tarefa');
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen && !isLoading) {
            setTitle('');
            setDescription('');
            setPriority('MEDIUM');
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
                    <DialogTitle className="text-white">Nova Tarefa</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Crie uma nova tarefa para este quadro
                    </DialogDescription>
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
                            placeholder="Nome da tarefa"
                            autoFocus
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-neutral-200">
                            Descrição (opcional)
                        </Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Descrição da tarefa"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-neutral-200">Prioridade</Label>
                        <div className="flex gap-2">
                            {(['LOW', 'MEDIUM', 'HIGH'] as PriorityType[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPriority(p)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${priority === p
                                            ? 'bg-primary text-white'
                                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                                        }`}
                                >
                                    {getPriorityLabel(p)}
                                </button>
                            ))}
                        </div>
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
                        Criar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}