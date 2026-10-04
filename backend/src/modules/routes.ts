import { Router } from "express";
import { authRouter } from "./auth/auth.routes.js";
import { ticketRouter } from "./ticket/ticket.routes.js";
import { subscriptionRouter } from "./subscriptions/subscription.routes.js";
import { notificationRouter } from "./notifications/notification.routes.js";

export const router = Router()

//aca se añadiran las rutas de cada modulo
router.use('/auth', authRouter)
router.use('/ticket', ticketRouter)
router.use('/subscription', subscriptionRouter)
router.use('/notifications', notificationRouter)