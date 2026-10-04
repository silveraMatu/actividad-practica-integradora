import { UnauthorizedError } from '../errors/appError.js'
import { Request, Response, NextFunction } from 'express'


export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.rol ) {
      return next(new UnauthorizedError('No autenticado o sin rol definido'))
    }
    const { rol } = req.user!
    if (!allowedRoles.includes(rol)) {
      return next(new UnauthorizedError('No tienes permisos para acceder a este recurso'))
    }
    next()
  }
}