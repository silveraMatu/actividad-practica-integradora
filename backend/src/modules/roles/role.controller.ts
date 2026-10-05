import { Request, Response, NextFunction } from "express";
import { IRoleService } from "./services/role.services.types.js";

export class RoleController {
  constructor(private roleService: IRoleService) {}

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await this.roleService.findAll();
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: roles
      })
    } catch (err) {
      next(err)
    }
  }
}
