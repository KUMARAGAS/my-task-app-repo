import { format } from "date-fns";
import { AlertCircle, Edit3, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const priorityColors = {
  Low: "bg-green-100 text-green-700 border-transparent",
  Medium: "bg-yellow-100 text-yellow-700 border-transparent",
  High: "bg-red-100 text-red-700 border-transparent",
};

const statusColors = {
  Pending: "bg-slate-100 text-slate-600 border-transparent",
  "In Progress": "bg-blue-100 text-blue-700 border-transparent",
  Completed: "bg-green-100 text-green-700 border-transparent",
};

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm space-y-2">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium">{task.title}</p>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="Edit"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={priorityColors[task.priority] || ""}>
          {task.priority}
        </Badge>
        <Badge className={statusColors[task.status] || ""}>
          {task.status}
        </Badge>
      </div>
      <p className={`text-xs flex items-center gap-1 ${task.is_overdue ? "text-red-600" : "text-slate-500"}`}>
        {task.is_overdue && <AlertCircle className="h-3 w-3" />}
        Due: {format(new Date(task.due_date), "MMM d, yyyy")}
      </p>
      {task.description && (
        <p className="text-xs text-slate-400 truncate">{task.description}</p>
      )}
    </div>
  );
}