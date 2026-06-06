import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  throw ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`);
};
