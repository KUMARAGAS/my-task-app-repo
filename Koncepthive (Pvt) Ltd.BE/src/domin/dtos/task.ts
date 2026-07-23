import { z } from "zod";

export const TaskPriorityEnum = z.enum(["Low", "Medium", "High"]);
export const TaskStatusEnum = z.enum(["Pending", "In Progress", "Completed"]);

export const CreateTaskDTO = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
  description: z.string().max(2000).optional().nullable(),
  priority: TaskPriorityEnum,
  status: TaskStatusEnum,
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format")
    .refine(
      (val) => new Date(val) >= new Date(new Date().toDateString()),
      { message: "Due date cannot be earlier than today" }
    ),
});

const UpdateTaskFields = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or less"),
  description: z.string().max(2000).optional().nullable(),
  priority: TaskPriorityEnum,
  status: TaskStatusEnum,
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
});

export const UpdateTaskDTO = UpdateTaskFields.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export const UuidParamDTO = z.object({
  id: z.string().uuid("Invalid task ID format"),
});
