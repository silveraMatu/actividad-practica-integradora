import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/appError.js";
import { verifyToken } from "../security/jwt.js";
import { authUserPayload } from "../types/express.js";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies('token')
    if (!token) {
      throw new UnauthorizedError("No se encuentra autenticado")
    }

    const decoded: authUserPayload = verifyToken(token)
    req.user = decoded
    next()
  } catch (err) {
    next(err)
  }
};