import { useEffect, useState } from 'react';
import type { PriorityType, Task } from '../../types';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../UI/dialog';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../UI/alert';
import { Label } from '../Board/label';
import { getPriorityLabel } from '../../lib/utils';

interface EditTaskModalProps {
    task?: Task;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description?: string; priority: PriorityType; }) => Promise<void>;
    onDelete?: () => Promise<void>;
    isLoading?: boolean;
}

export function EditTaskModal({ task, open, onClose, onSubmit, onDelete, isLoading }: EditTaskModalProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [priority, setPriority] = useState<PriorityType>(task?.priority || 'MEDIUM');
    const [error, setError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority);
        }
    }, [task]);

    const handleSubmit = async () => {
        if (!task) return;
        setError('');

        if (!title.trim()) {
            setError('O título é obrigatório');
            return;
        }

        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                priority
            });
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao atualizar tarefa');
        }
    };

    const handleDelete = async () => {
        if (!task || !onDelete) return;

        if (isDeleting) return;

        try {
            setIsDeleting(true);
            await onDelete();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao deletar tarefa');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen && !isLoading) {
            setError('');
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-neutral-900 border-red-900 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Editar Tarefa</DialogTitle>
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
                            placeholder="Nome da tarefa"
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
                                    type="button"
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

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    {onDelete && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDelete}
                            disabled={isLoading || isDeleting}
                            className="!bg-red-900 hover:!bg-red-800 text-white"
                        >
                            {isDeleting ? 'Deletando...' : 'Deletar'}
                        </Button>
                    )}
                    <div className="flex gap-2">
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
                            Salvar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}