import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const isPublicAccess =
    req.method === "GET" &&
    (/^\/api\/v1\/articles(\/[^/]+)?$/.test(req.originalUrl) ||
      /^\/api\/v1\/users(\/[^/]+)?$/.test(req.originalUrl));

  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (isPublicAccess && token) {
    try {
      req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret");
    } catch (err) {
      res.status(403).json({code: 403, message: "Forbidden"});
      return;
    }
    return next();
  }

  if (isPublicAccess && !token) {
    return next();
  }

  if (!token) {
    res.status(401).json({ code: 401, message: "Unauthorized" });
    return;
  }

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret");
    return next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(403).json({ code: 403, message: "Forbidden" });
    return;
  }
};
