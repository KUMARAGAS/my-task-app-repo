import { useState, useCallback } from "react";
import { useGetTasksQuery, useDeleteTaskMutation } from "@/lib/api/api";
import { buildTaskParams } from "@/lib/buildTaskParams";
import { useDebounce } from "@/lib/useDebounce";
import { extractErrorMessage } from "@/lib/extractErrorMessage";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/tasks/SearchBar";
import FilterBar from "@/components/tasks/FilterBar";
import SortDropdown from "@/components/tasks/SortDropdown";
import TaskList from "@/components/tasks/TaskList";
import TaskFormModal from "@/components/tasks/TaskFormModal";
import DeleteConfirmModal from "@/components/tasks/DeleteConfirmModal";
import { Plus } from "lucide-react";

const defaultQuery = {
  search: "",
  status: "",
  priority: "",
  sort: "newest",
  page: 1,
  limit: 10,
};

export default function TasksPage() {
  const [query, setQuery] = useState(defaultQuery);
  const debouncedSearch = useDebounce(query.search, 400);
  const [modalState, setModalState] = useState({
    taskFormOpen: false,
    deleteOpen: false,
    selectedTask: null,
  });
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const apiParams = buildTaskParams({ ...query, search: debouncedSearch });
  const { data, isLoading } = useGetTasksQuery(apiParams);

  const tasks = data?.tasks ?? [];
  const pagination = data?.pagination;

  const hasFilters = query.search !== "" || query.status !== "" || query.priority !== "";

  const updateQuery = useCallback((updates) => {
    setQuery((prev) => ({ ...prev, ...updates, page: 1 }));
  }, []);

  const handleEdit = (task) => {
    setModalState({ taskFormOpen: true, deleteOpen: false, selectedTask: task });
  };

  const handleDelete = (task) => {
    setModalState({ taskFormOpen: false, deleteOpen: true, selectedTask: task });
  };

  const handleFormSuccess = () => {
    setModalState({ taskFormOpen: false, deleteOpen: false, selectedTask: null });
  };

  const handleCloseModals = () => {
    setModalState({ taskFormOpen: false, deleteOpen: false, selectedTask: null });
  };

  const handleConfirmDelete = async () => {
    if (!modalState.selectedTask) return;
    try {
      await deleteTask(modalState.selectedTask.id).unwrap();
      toast.success("Task deleted.");
      handleCloseModals();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button
          onClick={() => setModalState({ taskFormOpen: true, deleteOpen: false, selectedTask: null })}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={query.search} onChange={(v) => updateQuery({ search: v })} />
        </div>
        <FilterBar
          statusFilter={query.status}
          priorityFilter={query.priority}
          onStatusChange={(v) => updateQuery({ status: v === "all" ? "" : v })}
          onPriorityChange={(v) => updateQuery({ priority: v === "all" ? "" : v })}
        />
        <SortDropdown value={query.sort} onChange={(v) => updateQuery({ sort: v })} />
      </div>

      <p className="text-sm text-slate-500">
        Showing {tasks.length}{pagination ? ` of ${pagination.total}` : ""} tasks
      </p>

      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchQuery={query.search}
        hasFilters={hasFilters}
      />

      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => setQuery((prev) => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.total_pages}
            onClick={() => setQuery((prev) => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      <TaskFormModal
        isOpen={modalState.taskFormOpen}
        onClose={handleCloseModals}
        onSuccess={handleFormSuccess}
        task={modalState.selectedTask}
      />

      <DeleteConfirmModal
        isOpen={modalState.deleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        taskTitle={modalState.selectedTask?.title || ""}
        isLoading={isDeleting}
      />
    </div>
  );
}