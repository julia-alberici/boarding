import { Pencil, Trash } from 'lucide-react';
import type { Board } from '../../types';
import { Button } from '../UI/Button';
import { Link } from 'react-router-dom';

interface BoardCardProps {
    board: Board;
    onEdit: (board: Board) => void;
    onDelete: (id: string) => Promise<void>;
}

export const BoardCard = ({ board, onEdit, onDelete }: BoardCardProps) => {
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (confirm('Tem certeza que deseja excluir este quadro?')) {
            await onDelete(board.id);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        onEdit(board);
    };

    return (
        <Link
            to={`/board/${board.id}`}
            className="block bg-card rounded-lg shadow-sm shadow-accent hover:shadow-md transition-shadow duration-200"
        >
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-[#F5F5F5] line-clamp-1">
                        {board.title}
                    </h3>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={handleEdit}
                            className="!p-1"
                        >
                            <Pencil />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="!p-1"
                        >
                            <Trash />
                        </Button>
                    </div>
                </div>

                {board.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {board.description}
                    </p>
                )}

                <div className="text-xs text-gray-500">
                    Criado em: {new Date(board.createdAt).toLocaleDateString()}
                </div>
            </div>
        </Link>
    );
};