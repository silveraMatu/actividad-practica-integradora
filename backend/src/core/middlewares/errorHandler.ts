import { AppError } from "../errors/appError.js";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      error: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  console.error(err);
  return res.status(500).json({
    status: "error",
    statusCode: 500,
    error: 'Internal Server Error'
  });
};