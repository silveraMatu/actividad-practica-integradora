import { Router } from "express";
import { RoleRepository } from "../roles/role.repository.js";
import { AuthService } from "./services/auth.service.js";
import { AuthController } from "./auth.controller.js";
import { UserRepository } from "../user/repository/user.repository.js";
import { bcryptService } from "../../core/security/hasher/bcrypt.js";

export const authRouter = Router();

const userRepo = new UserRepository()
const roleRepo = new RoleRepository();
const hasher =  new bcryptService()
const authService = new AuthService(userRepo, roleRepo, hasher);
const controller = new AuthController(authService);

authRouter.post("/register", controller.register);
authRouter.post("/login", controller.login);
authRouter.post("/logout", controller.logout);
