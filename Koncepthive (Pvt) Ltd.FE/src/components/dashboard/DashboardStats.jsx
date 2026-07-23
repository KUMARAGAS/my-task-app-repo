import { ListTodo, Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useGetDashboardStatsQuery } from "@/lib/api/api";
import StatCard from "./StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const statConfig = [
  { label: "Total Tasks", key: "total", icon: ListTodo, colorClass: "bg-slate-50 text-slate-600" },
  { label: "Pending", key: "pending", icon: Clock, colorClass: "bg-yellow-50 text-yellow-600" },
  { label: "In Progress", key: "in_progress", icon: Loader2, colorClass: "bg-blue-50 text-blue-600" },
  { label: "Completed", key: "completed", icon: CheckCircle2, colorClass: "bg-green-50 text-green-600" },
  { label: "Overdue", key: "overdue", icon: AlertCircle, colorClass: "bg-red-50 text-red-600" },
];

export default function DashboardStats() {
  const { data, isLoading, isError, refetch } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Failed to load dashboard stats.</p>
        <Button variant="outline" onClick={refetch}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statConfig.map((stat) => (
        <StatCard
          key={stat.key}
          label={stat.label}
          value={data?.[stat.key] ?? 0}
          icon={<stat.icon className="h-5 w-5" />}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
}