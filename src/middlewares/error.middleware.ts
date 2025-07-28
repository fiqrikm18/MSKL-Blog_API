// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import {ArticleNotFoundException} from "../domain/article/exception/ArticleNotFoundException";
import {AuthenticationException, UserNotAuthenticatedException} from "../domain/user/exception/AuthenticatioException";
import {UserAlreadyExistsException, UserNotFoundException} from "../domain/user/exception/UserException";
import {ErrorResponse} from "../utils/http/responser";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  if (
    err instanceof ArticleNotFoundException ||
    err instanceof AuthenticationException ||
    err instanceof UserAlreadyExistsException ||
    err instanceof UserNotFoundException ||
    err instanceof UserNotAuthenticatedException
  ) {
    return res.status(err.getCode()).json({
      code: err.getCode(),
      message: err.message,
    } as ErrorResponse);
  }

  return res.status(500).json({
    code: 500,
    message: err.message || "Internal Server Error",
    cause: err.cause || undefined,
  });
};
