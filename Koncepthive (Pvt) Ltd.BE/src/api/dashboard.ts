import express from "express";
import { isAuthenticated } from "./middlewares/authentication-middleware";
import { getDashboard } from "../application/task";

const dashboardRouter = express.Router();

dashboardRouter.get("/", isAuthenticated, getDashboard);

export default dashboardRouter;
