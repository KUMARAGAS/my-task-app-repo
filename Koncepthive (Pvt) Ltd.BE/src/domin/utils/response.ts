import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: unknown,
  message?: string,
  statusCode = 200
) => {
  res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
) => {
  const error: { code: string; message: string; details?: unknown } = {
    code,
    message,
  };
  if (details !== undefined) {
    error.details = details;
  }
  res.status(statusCode).json({
    success: false,
    error,
  });
};
