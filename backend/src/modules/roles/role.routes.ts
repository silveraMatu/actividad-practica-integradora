import { Router } from 'express'
import { RoleController } from './role.controller.js'
import { requireRole as role } from '../../common/middlewares/role.middleware.js'
import { authMiddleware as auth } from '../../common/middlewares/auth.middleware.js'

export function createRoleRouter(roleController: RoleController): Router {
  const roleRouter = Router()

  roleRouter.get('/', auth, role('admin'), roleController.findAll)

  return roleRouter
}
