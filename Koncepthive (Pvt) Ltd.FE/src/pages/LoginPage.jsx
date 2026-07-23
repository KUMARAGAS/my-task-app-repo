import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import AuthLayout from "@/layouts/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import { ListTodo } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-6">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary text-primary-foreground mb-3">
          <ListTodo className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold">Task Manager</h1>
        <p className="text-sm text-slate-500 mt-1">Sign in to manage your tasks</p>
      </div>
      <LoginForm />
    </AuthLayout>
  );
}