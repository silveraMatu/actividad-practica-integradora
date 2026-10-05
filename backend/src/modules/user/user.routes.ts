import { Router } from 'express'
import { UserController } from './user.controller.js'
import { assignRoleValidations } from './user.validations.js'
import { validate } from '../../common/middlewares/validate.js'
import { requireRole as role } from '../../common/middlewares/role.middleware.js'
import { authMiddleware as auth} from '../../common/middlewares/auth.middleware.js'

export function createUserRouter(userController: UserController): Router {
  const userRouter = Router()

  userRouter.get('/', auth, role('admin'), userController.findAll)
  userRouter.patch('/:id', auth, role('admin'), assignRoleValidations, validate, userController.assignRole)

  return userRouter
}
