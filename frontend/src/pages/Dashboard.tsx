import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { BoardCard } from '../components/Board/BoardCard';
import { CreateBoardModal } from '../components/Board/CreateBoardModal';
import { Button } from '../components/UI/Button';
import { useBoardStore } from '../store/board.store';
import type { Board } from '../types';

const Dashboard = () => {
    const { boards, isLoading, error, fetchBoards, createBoard, updateBoard, deleteBoard } = useBoardStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);

    useEffect(() => {
        fetchBoards().catch(console.error);
    }, [fetchBoards]);

    const handleCreateBoard = async (title: string, description?: string) => {
        await createBoard(title, description);
    };

    const handleUpdateBoard = async (title: string, description?: string, id?: string) => {
        if (!id) return;
        await updateBoard(id, title, description);
        setEditingBoard(null);
    };

    const handleDeleteBoard = async (id: string) => {
        await deleteBoard(id);
    };

    if (error) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <p className="text-red-500">
                        {error}
                    </p>
                    <Button
                        onClick={() => fetchBoards()}
                        className="mt-4"
                    >
                        Tentar novamente
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#F5F5F5]">
                        Meus Quadros
                    </h2>
                    <Button onClick={() => setShowCreateModal(true)}>
                        Novo Quadro
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="h-32 bg-gray-200 rounded-lg animate-pulse"
                            />
                        ))}
                    </div>
                ) : boards.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-[#F5F5F5]">
                            Nenhum quadro ainda
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Comece criando seu primeiro quadro
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {boards.map((board) => (
                            <BoardCard
                                key={board.id}
                                board={board}
                                onEdit={setEditingBoard}
                                onDelete={handleDeleteBoard}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateBoardModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateBoard}
                isLoading={isLoading}
            />

            {editingBoard && (
                <CreateBoardModal
                    open={editingBoard !== null}
                    board={editingBoard}
                    onClose={() => { setEditingBoard(null)}}
                    onSubmit={handleUpdateBoard}
                    isLoading={isLoading}
                />
            )}
        </DashboardLayout>
    );
};

export default Dashboard;
