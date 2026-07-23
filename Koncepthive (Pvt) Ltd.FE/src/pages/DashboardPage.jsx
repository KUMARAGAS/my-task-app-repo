import { useSelector } from "react-redux";
import { Link } from "react-router";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back, {user?.name || "User"}
        </p>
      </div>

      <DashboardStats />

      <div className="pt-2">
        <Link to="/tasks">
          <Button variant="outline" className="gap-2">
            Manage Tasks
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}