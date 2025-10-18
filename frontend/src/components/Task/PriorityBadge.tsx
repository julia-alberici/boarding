import { Badge } from "@/components/UI/badge";
import type { PriorityType } from "@/types";
import { getPriorityLabel } from "../../lib/utils";

const priorityColors = {
    LOW: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    MEDIUM: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    HIGH: "bg-red-100 text-red-800 hover:bg-red-100",
};

interface PriorityBadgeProps {
    priority: PriorityType;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
    return (
        <Badge className={`${priorityColors[priority]} font-medium`}>
            {getPriorityLabel(priority)}
        </Badge>
    );
}