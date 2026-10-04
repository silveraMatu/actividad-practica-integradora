import { Router } from "express";
import { RoleRepository } from "../roles/role.repository.js";
import { AuthService } from "./services/auth.service.js";
import { AuthController } from "./auth.controller.js";
import { UserRepository } from "../user/repository/user.repository.js";
import { bcryptService } from "../../common/security/hasher/bcrypt.js";
import { loginValidator, registerValidator } from "./auth.validator.js";
import { validate } from "../../common/middlewares/validate.js";

export const authRouter = Router();

const userRepo = new UserRepository()
const roleRepo = new RoleRepository();
const hasher =  new bcryptService()
const authService = new AuthService(userRepo, roleRepo, hasher);
const controller = new AuthController(authService);

authRouter.post("/register", registerValidator, validate, controller.register);
authRouter.post("/login", loginValidator, validate, controller.login);
authRouter.post("/logout", controller.logout);
