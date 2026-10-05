import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { loginValidator, registerValidator } from "./auth.validator.js";
import { validate } from "../../common/middlewares/validate.js";

export function createAuthRouter(controller: AuthController): Router {
  const authRouter = Router();

  authRouter.post("/register", registerValidator, validate, controller.register);
  authRouter.post("/login", loginValidator, validate, controller.login);
  authRouter.post("/logout", controller.logout);

  return authRouter;
}
