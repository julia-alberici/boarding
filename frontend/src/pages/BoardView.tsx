import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Alert } from '../components/UI/alert';
import { Button } from '../components/UI/Button';
import { DraggableList } from '../components/Board/DraggableList';
import { useBoardStore } from '../store/board.store';
import { useListStore } from '../store/list.store';
import { useTaskStore } from '../store/task.store';

export function BoardView() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string; }>();
    const { currentBoard, isLoading: boardLoading, error: boardError, fetchBoardById } = useBoardStore();
    const { lists, isLoading: listLoading, fetchListsByBoardId } = useListStore();
    const { moveTask } = useTaskStore();

    useEffect(() => {
        if (id) {
            fetchBoardById(id);
        }
    }, [id, fetchBoardById]);

    useEffect(() => {
        if (id) {
            fetchListsByBoardId(id);
        }
    }, [id, fetchListsByBoardId]);

    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        // No movement
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        try {
            await moveTask(
                draggableId,
                destination.index,
                source.droppableId,
                destination.droppableId
            );
        } catch (error) {
            console.error('Error moving task:', error);
        }
    };

    if (boardLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (boardError) {
        return (
            <div className="p-4">
                <Alert variant="destructive">
                    <p>{boardError}</p>
                </Alert>
            </div>
        );
    }

    if (!currentBoard) {
        return (
            <div className="p-4">
                <Alert>
                    <p>Board não encontrado</p>
                </Alert>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Board Header */}
            <div className="p-4 border-b flex items-center gap-3">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/')}
                    className="p-2 h-auto"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">{currentBoard.title}</h1>
                {currentBoard.description && (
                    <p className="text-sm text-gray-600 mt-1">{currentBoard.description}</p>
                )}
            </div>

            {/* Lists Container */}
            <div className="flex-1 overflow-x-auto">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex gap-4 p-4 min-h-full md:flex-row flex-col">
                        {/* Lista de navegação para mobile */}
                        <div className="md:hidden flex sticky overflow-x-auto top-0 bg-background z-10 p-2 -mx-4 mb-2">
                            {currentBoard && lists[currentBoard.id]?.map((list) => (
                                <button
                                    key={list.id}
                                    className="flex-shrink-0 px-4 py-2 rounded-full bg-muted mr-2 text-sm font-medium"
                                    onClick={() => document.getElementById(list.id)?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    {list.title} ({list.tasks.length})
                                </button>
                            ))}
                        </div>

                        {/* Listas de tarefas */}
                        <div className="flex md:flex-row flex-col gap-4">
                            {currentBoard && lists[currentBoard.id]?.map((list) => (
                                <DraggableList
                                    key={list.id}
                                    list={list}
                                />
                            ))}
                        </div>
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
};

export default BoardView;