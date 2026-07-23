import express from "express";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../application/task";

const tasksRouter = express.Router();

tasksRouter.use(isAuthenticated);

tasksRouter.route("/").get(getTasks).post(createTask);
tasksRouter.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default tasksRouter;
