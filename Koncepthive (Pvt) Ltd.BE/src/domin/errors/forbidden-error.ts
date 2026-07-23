import AppError from "./app-error";

class ForbiddenError extends AppError {
    constructor(message: string) {
      super(message, 403);
      this.name = "ForbiddenError";
    }
  }

  export default ForbiddenError;
