class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code ?? mapStatusToCode(statusCode);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

function mapStatusToCode(status: number): string {
  const map: Record<number, string> = {
    400: "VALIDATION_ERROR",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    500: "SERVER_ERROR",
  };
  return map[status] ?? "SERVER_ERROR";
}

export default AppError;
