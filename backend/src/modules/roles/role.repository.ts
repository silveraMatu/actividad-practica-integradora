import { Role, type IRole } from "../../core/database/entities/role.js";

export interface IRoleRepository {
  getDefault(): Promise<IRole | null>;
}

export class RoleRepository implements IRoleRepository {
  async getDefault(): Promise<IRole | null> {
    return await Role.findOne({ name: "usuario" }).exec();
  }
}
