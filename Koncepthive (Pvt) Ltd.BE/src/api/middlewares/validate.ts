import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { sendError } from "../../domin/utils/response";

export const validate = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        sendError(res, 400, "VALIDATION_ERROR", "Request validation failed", [
          ...err.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        ]);
        return;
      }
      next(err);
    }
  };
