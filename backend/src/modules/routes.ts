import { Router } from "express";

export interface ApiRouters {
  authRouter: Router;
  userRouter: Router;
  ticketRouter: Router;
  subscriptionRouter: Router;
  notificationRouter: Router;
}

export function createRouter(routers: ApiRouters): Router {
  const router = Router()

  //aca se añadiran las rutas de cada modulo
  router.use('/auth', routers.authRouter)
  router.use('/user', routers.userRouter)
  router.use('/ticket', routers.ticketRouter)
  router.use('/subscription', routers.subscriptionRouter)
  router.use('/notifications', routers.notificationRouter)

  return router
}