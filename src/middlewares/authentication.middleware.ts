// src/middlewares/authentication.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ code: 401, message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "secret"
    );
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ code: 403, message: "Forbidden" });
  }
};
