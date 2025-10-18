import { Droppable } from '@hello-pangea/dnd';
import type { List } from '../../types';
import { TaskCard } from '../Task';
import { Button } from '../UI/Button';
import { CreateTaskModal } from '../Task/CreateTaskModal';
import { useState, useEffect } from 'react';
import { useTaskStore } from '../../store/task.store';

interface DraggableListProps {
    list: List;
}

export function DraggableList({ list }: DraggableListProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { createTask, isLoading, tasks, fetchTasks } = useTaskStore();

    // Load tasks when list mounts
    useEffect(() => {
        fetchTasks(list.id);
    }, [list.id, fetchTasks]);

    const listTasks = tasks[list.id] || [];

    const handleCreateTask = async (
        listId: string,
        title: string,
        description?: string,
        priority?: 'LOW' | 'MEDIUM' | 'HIGH'
    ) => {
        await createTask(listId, title, description, priority);
    };

    return (
        <div id={list.id} className="flex-shrink-0 md:w-80 w-full bg-card rounded-lg shadow p-3 scroll-mt-16">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">{list.title}</h3>
                <span className="text-sm text-gray-500">{listTasks.length} tarefas</span>
            </div>

            <Droppable droppableId={list.id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] transition-colors rounded ${snapshot.isDraggingOver ? 'bg-neutral-800/50' : ''
                            }`}
                    >
                        <div className="space-y-2">
                            {listTasks.map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    index={index}
                                />
                            ))}
                        </div>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            <div className="mt-3">
                <Button
                    onClick={() => setShowCreateModal(true)}
                    variant="outline"
                    className="w-full text-sm"
                >
                    + Nova Tarefa
                </Button>
            </div>

            <CreateTaskModal
                listId={list.id}
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateTask}
                isLoading={isLoading}
            />
        </div>
    );
}