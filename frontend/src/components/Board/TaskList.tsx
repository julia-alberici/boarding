import { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { TaskCard } from '../Task';
import { CreateTaskModal } from '../Task/CreateTaskModal';
import { useTaskStore } from '../../store/task.store';

interface TaskListProps {
    listId: string;
}

export function TaskList({ listId }: TaskListProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { isLoading, error, createTask, fetchTasks } = useTaskStore();

    useEffect(() => {
        fetchTasks(listId).catch(console.error);
    }, [listId, fetchTasks]);

    const listTasks = tasks[listId] || [];

    const handleCreateTask = async (
        listId: string,
        title: string,
        description?: string,
        priority?: 'LOW' | 'MEDIUM' | 'HIGH'
    ) => {
        await createTask(listId, title, description, priority);
    };

    if (error) {
        return (
            <div className="p-2 text-center text-red-500 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-2 mt-2">
            {isLoading ? (
                <div className="animate-pulse space-y-2">
                    {[1, 2].map((n) => (
                        <div
                            key={n}
                            className="h-20 bg-neutral-800 rounded-lg"
                        />
                    ))}
                </div>
            ) : (
                <>
                    {listTasks.map((task, index) => (
                        <TaskCard
                            index={index}
                            key={task.id}
                            task={task}
                        />
                    ))}

                    {!listTasks.length && (
                        <div className="p-2 text-center text-gray-500 text-sm">
                            Nenhuma tarefa nesta lista
                        </div>
                    )}

                    <div className="pt-2">
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            variant="outline"
                            className="w-full text-sm"
                        >
                            + Nova Tarefa
                        </Button>
                    </div>

                    <CreateTaskModal
                        listId={listId}
                        open={showCreateModal}
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreateTask}
                        isLoading={isLoading}
                    />
                </>
            )}
        </div>
    );
}