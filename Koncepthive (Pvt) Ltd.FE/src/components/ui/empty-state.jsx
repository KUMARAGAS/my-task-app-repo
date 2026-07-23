import { ClipboardList, SearchX } from "lucide-react";

export function EmptyState({ hasFilters }) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 mb-4">
          <SearchX className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-medium text-slate-900">No tasks found</h3>
        <p className="text-sm text-slate-500 mt-1">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 mb-4">
        <ClipboardList className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-medium text-slate-900">No tasks yet</h3>
      <p className="text-sm text-slate-500 mt-1">
        Create your first task to get started.
      </p>
    </div>
  );
}