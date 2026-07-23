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

export default function TaskRow({ task, onEdit, onDelete }) {
  return (
    <tr className="border-b last:border-0 hover:bg-slate-50 transition-colors">
      <td className="py-3 px-4">
        <span className="text-sm font-medium truncate max-w-[300px] block" title={task.title}>
          {task.title}
        </span>
      </td>
      <td className="py-3 px-4">
        <Badge className={priorityColors[task.priority] || ""}>
          {task.priority}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <Badge className={statusColors[task.status] || ""}>
          {task.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <span className={`text-sm flex items-center gap-1 ${task.is_overdue ? "text-red-600" : ""}`}>
          {task.is_overdue && <AlertCircle className="h-3.5 w-3.5" />}
          {format(new Date(task.due_date), "MMM d, yyyy")}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            title="Edit"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}