import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import TaskRow from "./TaskRow";
import TaskCard from "./TaskCard";

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-b">
      {Array.from({ length: 5 }).map((_, j) => (
        <td key={j} className="py-3 px-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  ));
}

function SkeletonCards() {
  return Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={i} className="h-28 rounded-xl" />
  ));
}

export default function TaskList({ tasks, isLoading, onEdit, onDelete, searchQuery, hasFilters }) {
  if (isLoading) {
    return (
      <>
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs text-slate-500 uppercase">
                <th className="py-3 px-4 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Due Date</th>
                <th className="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <SkeletonRows />
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 md:hidden">
          <SkeletonCards />
        </div>
      </>
    );
  }

  if (tasks.length === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-xs text-slate-500 uppercase">
              <th className="py-3 px-4 font-medium">Title</th>
              <th className="py-3 px-4 font-medium">Priority</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Due Date</th>
              <th className="py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </>
  );
}