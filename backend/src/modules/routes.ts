import { Router } from "express";
import { authRouter } from "./auth/auth.routes.js";

const router = Router()

//aca se añadiran las rutas de cada modulo
router.use('/auth', authRouter)