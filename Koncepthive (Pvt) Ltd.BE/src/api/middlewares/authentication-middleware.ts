import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UnauthorizedError from "../../domin/errors/unauthorized-error";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const isAuthenticated = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
