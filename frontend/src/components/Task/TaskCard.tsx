import { useState } from "react";
import { Card } from "@/components/UI/card";
import type { PriorityType, Task } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { EllipsisVertical } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { Button } from "../UI/Button";
import { EditTaskModal } from "./EditTaskModal";
import { useTaskStore } from "../../store/task.store";
import { ptBR } from 'date-fns/locale';
import { Draggable } from '@hello-pangea/dnd';

interface TaskCardProps {
    task: Task;
    index: number;
    onMoveUp?: (taskId: string) => void;
    onMoveDown?: (taskId: string) => void;
}

export function TaskCard({ task, index }: TaskCardProps) {
    const [showEditModal, setShowEditModal] = useState(false);
    const { updateTask, deleteTask, isLoading } = useTaskStore();

    const formattedDate = formatDistanceToNow(new Date(task.createdAt), {
        addSuffix: true,
        locale: ptBR
    });

    const handleUpdateTask = async (data: { title: string; description?: string; priority: PriorityType; }) => {
        await updateTask(task, data);
    };

    const handleDeleteTask = async () => {
        await deleteTask(task);
    };

    return (
        <>
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Card className={`p-4 space-y-3 transition-shadow ${snapshot.isDragging ? 'shadow-lg' : 'hover:shadow-md'}`}>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-medium text-sm">{task.title}</h3>
                                    {task.description && (
                                        <p className="text-sm text-gray-500">{task.description}</p>
                                    )}
                                </div>
                                <Button variant="outline" className="h-8 w-8 !p-0" onClick={() => setShowEditModal(true)}>
                                    <EllipsisVertical className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <PriorityBadge priority={task.priority} />
                                    <span className="text-xs text-gray-500">{formattedDate}</span>
                                </div>
                                {!task.assignedId && (
                                    <span className="text-xs text-gray-500">Não atribuído</span>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </Draggable>

            <EditTaskModal
                task={task}
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleUpdateTask}
                onDelete={handleDeleteTask}
                isLoading={isLoading}
            />
        </>
    );
}