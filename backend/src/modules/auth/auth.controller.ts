import { Request, Response, NextFunction } from "express";
import { IAuthService } from "./services/auth.service.types.js";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.create(req.body);

      res.status(201).json({
        status: "OK",
        statusCode: 201,
        message: "Usuario creado con éxito",
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.login(req.body);

      res.cookie("token", user?.token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
      });

      res.status(200).json({
        status: "OK",
        message: "Inicio de sesión exitoso",
        user
      });
    } catch (err) {
      next(err);
    }
  };

  logout = (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("token");
      res.status(200).json( {
          status: "OK",
          message: "Has cerrado sesión"
        });
    } catch (err) {
      next(err);
    }
  };
}
