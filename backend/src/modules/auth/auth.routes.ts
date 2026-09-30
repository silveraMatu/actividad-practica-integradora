import { Router } from "express";
import { AuthRepository } from "./auth.repository.js";
import { RoleRepository } from "../roles/role.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";

export const authRouter = Router()

const authRepository = new AuthRepository()
const roleRepository = new RoleRepository()
const authService = new AuthService(authRepository, roleRepository)
const controller = new AuthController(authService)

authRouter.post('/register', controller.register)
authRouter.post('/login', controller.login)
authRouter.post('/logout', controller.logout)