import { UnauthorizedError } from '../errors/appError.js'
import { Request, Response, NextFunction } from 'express'


export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role ) {
      return next(new UnauthorizedError('No autenticado o sin rol definido'))
    }
    const { role } = req.user!
    if (!allowedRoles.includes(role)) {
      return next(new UnauthorizedError('No tienes permisos para acceder a este recurso'))
    }
    next()
  }
}