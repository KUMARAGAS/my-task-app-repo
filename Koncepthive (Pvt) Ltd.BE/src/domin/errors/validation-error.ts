import AppError from "./app-error";

class ValidationError extends AppError {
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(message: string, details?: Array<{ field: string; message: string }>) {
    super(message, 400);
    this.name = "ValidationError";
    this.details = details;
  }
}

export default ValidationError;
