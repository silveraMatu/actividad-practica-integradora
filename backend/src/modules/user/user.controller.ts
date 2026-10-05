import { Request, Response, NextFunction } from "express";
import { IUserService } from "./services/user.services.types.js";

export class UserController {
  constructor(private userService: IUserService) {}

  assignRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id!;
      const { roleId } = req.body;
      const user = await this.userService.assignRole(id.toString(), roleId);
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: user
      })
    } catch (err) {
      next(err)
    }
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: users
      })
    } catch (err) {
      next(err)
    }
  }
}