import { Router } from "express";
import { authRouter } from "./auth/auth.routes.js";

export const router = Router()

//aca se añadiran las rutas de cada modulo
router.use('/auth', authRouter)