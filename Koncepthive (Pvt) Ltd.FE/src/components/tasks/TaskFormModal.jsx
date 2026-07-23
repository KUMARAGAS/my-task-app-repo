import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@/lib/api/api";
import { extractErrorMessage } from "@/lib/extractErrorMessage";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const today = () => new Date(new Date().toDateString());

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),
  description: z.string().max(2000).optional().nullable(),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Select a priority" }),
  }),
  status: z.enum(["Pending", "In Progress", "Completed"], {
    errorMap: () => ({ message: "Select a status" }),
  }),
  due_date: z.string().min(1, "Due date is required"),
});

export default function TaskFormModal({ isOpen, onClose, onSuccess, task }) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const isEditMode = task !== null && task !== undefined;
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: undefined,
      status: undefined,
      due_date: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        reset({
          title: task.title,
          description: task.description ?? "",
          priority: task.priority,
          status: task.status,
          due_date: task.due_date ? task.due_date.split("T")[0] : "",
        });
      } else {
        reset({
          title: "",
          description: "",
          priority: undefined,
          status: undefined,
          due_date: "",
        });
      }
    }
  }, [task, isOpen]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateTask({ id: task.id, ...data }).unwrap();
        toast.success("Task updated.");
      } else {
        await createTask(data).unwrap();
        toast.success("Task created.");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err) || "Failed to save task.");
    }
  };

  const watchedPriority = watch("priority");
  const watchedStatus = watch("status");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Task" : "New Task"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the task details below." : "Fill in the details to create a new task."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select
                value={watchedPriority || ""}
                onValueChange={(v) => setValue("priority", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-600">{errors.priority.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("due_date")}
              />
              {errors.due_date && <p className="text-sm text-red-600">{errors.due_date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status *</Label>
            <Select
              value={watchedStatus || ""}
              onValueChange={(v) => setValue("status", v, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-600">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}