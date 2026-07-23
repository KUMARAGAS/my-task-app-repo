import { Request, Response, NextFunction } from "express";
import AppError from "../../domin/errors/app-error";
import ValidationError from "../../domin/errors/validation-error";

const globalErrorHandlingMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    const body: Record<string, unknown> = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    };
    if (error instanceof ValidationError && error.details) {
      (body.error as Record<string, unknown>).details = error.details;
    }
    res.status(error.statusCode).json(body);
    return;
  }

  console.error("[Unhandled Error]", error);
  res.status(500).json({
    success: false,
    error: {
      code: "SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};

export default globalErrorHandlingMiddleware;
