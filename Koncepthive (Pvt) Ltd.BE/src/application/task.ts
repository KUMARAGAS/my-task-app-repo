import { NextFunction, Response } from "express";
import prisma from "../infrastructure/db";
import { TaskStatus, TaskPriority } from "@prisma/client";
import NotFoundError from "../domin/errors/not-found-error";
import ValidationError from "../domin/errors/validation-error";
import { sendSuccess } from "../domin/utils/response";
import { AuthRequest } from "../api/middlewares/authentication-middleware";
import { CreateTaskDTO, UpdateTaskDTO } from "../domin/dtos/task";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapStatus(status: string): TaskStatus {
  return status === "In Progress" ? "In_Progress" : (status as TaskStatus);
}

function unmapStatus(status: TaskStatus): string {
  return status === "In_Progress" ? "In Progress" : status;
}

function formatTask(task: Record<string, unknown>) {
  return {
    ...task,
    status: unmapStatus(task.status as TaskStatus),
  };
}

export const getDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.sub;
    const now = new Date();

    const [total, pending, in_progress, completed, overdue] =
      await Promise.all([
        prisma.task.count({ where: { user_id: userId } }),
        prisma.task.count({ where: { user_id: userId, status: "Pending" } }),
        prisma.task.count({
          where: { user_id: userId, status: "In_Progress" },
        }),
        prisma.task.count({
          where: { user_id: userId, status: "Completed" },
        }),
        prisma.task.count({
          where: {
            user_id: userId,
            status: { not: "Completed" },
            due_date: { lt: now },
          },
        }),
      ]);

    sendSuccess(res, { total, pending, in_progress, completed, overdue });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.sub;
    const {
      search,
      status,
      priority,
      sort = "newest",
      page = "1",
      limit = "10",
    } = req.query as Record<string, string>;

    const where: Record<string, unknown> = { user_id: userId };

    if (status) {
      where.status = mapStatus(status);
    }
    if (priority) {
      where.priority = priority;
    }
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const orderBy: Record<string, string> =
      sort === "newest"
        ? { created_at: "desc" }
        : sort === "oldest"
          ? { created_at: "asc" }
          : { due_date: "asc" };

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.task.count({ where }),
    ]);

    const now = new Date();
    const tasksWithOverdue = tasks.map((task) =>
      formatTask({
        ...task,
        is_overdue:
          task.status !== "Completed" && new Date(task.due_date) < now,
      })
    );

    sendSuccess(res, {
      tasks: tasksWithOverdue,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        total_pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.sub;
    const taskId = req.params.id;

    if (!UUID_REGEX.test(taskId)) {
      throw new ValidationError("Invalid task ID format");
    }

    const task = await prisma.task.findFirst({
      where: { id: taskId, user_id: userId },
    });
    if (!task) {
      throw new NotFoundError("Task not found");
    }

    const now = new Date();
    sendSuccess(
      res,
      formatTask({
        ...task,
        is_overdue:
          task.status !== "Completed" && new Date(task.due_date) < now,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = CreateTaskDTO.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(
        "Request validation failed",
        parsed.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }

    const userId = req.user!.sub;

    const task = await prisma.task.create({
      data: {
        user_id: userId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        priority: parsed.data.priority as TaskPriority,
        status: mapStatus(parsed.data.status),
        due_date: new Date(parsed.data.due_date),
      },
    });

    const now = new Date();
    sendSuccess(
      res,
      formatTask({
        ...task,
        is_overdue:
          task.status !== "Completed" && new Date(task.due_date) < now,
      }),
      "Task created successfully",
      201
    );
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.sub;
    const taskId = req.params.id;

    if (!UUID_REGEX.test(taskId)) {
      throw new ValidationError("Invalid task ID format");
    }

    const parsed = UpdateTaskDTO.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(
        "Request validation failed",
        parsed.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }

    const existing = await prisma.task.findFirst({
      where: { id: taskId, user_id: userId },
    });
    if (!existing) {
      throw new NotFoundError("Task not found");
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) data.title = parsed.data.title;
    if (parsed.data.description !== undefined)
      data.description = parsed.data.description;
    if (parsed.data.priority !== undefined)
      data.priority = parsed.data.priority;
    if (parsed.data.status !== undefined) {
      data.status = mapStatus(parsed.data.status);
    }
    if (parsed.data.due_date !== undefined)
      data.due_date = new Date(parsed.data.due_date);

    const task = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    const now = new Date();
    sendSuccess(
      res,
      formatTask({
        ...task,
        is_overdue:
          task.status !== "Completed" && new Date(task.due_date) < now,
      }),
      "Task updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.sub;
    const taskId = req.params.id;

    if (!UUID_REGEX.test(taskId)) {
      throw new ValidationError("Invalid task ID format");
    }

    const existing = await prisma.task.findFirst({
      where: { id: taskId, user_id: userId },
    });
    if (!existing) {
      throw new NotFoundError("Task not found");
    }

    await prisma.task.delete({ where: { id: taskId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
