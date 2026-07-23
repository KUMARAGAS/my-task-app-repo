import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./infrastructure/db";
import authRouter from "./api/auth";
import tasksRouter from "./api/task";
import dashboardRouter from "./api/dashboard";
import globalErrorHandlingMiddleware from "./api/middlewares/global-error-handling-middleware";
import { seedAdminUser } from "./application/seed";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/dashboard", dashboardRouter);

app.use(globalErrorHandlingMiddleware);

const port = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB();
    await seedAdminUser().catch((err) => {
      console.error("[Seed] Failed to seed admin user:", err);
    });
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
