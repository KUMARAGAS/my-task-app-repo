import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../infrastructure/db";
import { LoginDTO } from "../domin/dtos/auth";
import ValidationError from "../domin/errors/validation-error";
import UnauthorizedError from "../domin/errors/unauthorized-error";
import { sendSuccess } from "../domin/utils/response";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = LoginDTO.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError(
        "Request validation failed",
        parsed.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }))
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
    );

    sendSuccess(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};
