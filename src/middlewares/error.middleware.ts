// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return res.status(err.code || 500).json({
    code: err.code || 500,
    message: err.message || "Internal Server Error",
    cause: err.cause || undefined,
  });
};
