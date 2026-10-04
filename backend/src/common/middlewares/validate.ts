import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/appError.js";

export const validate = (req: Request, _res: Response, next: NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map(err => ({
      field: err.type === "field" ? err.path : err.type,
      message: String(err.msg)
    }));
    return next(new BadRequestError("Error de validación", errors));
  }

  next();
};
