import { Role, type IRole } from "./role.model.js";

export interface IRoleRepository {
  getDefault(): Promise<IRole | null>;
  findById(id: string): Promise<IRole | null>;
}

export interface createRolesDTO {
  name: string
}

export class RoleRepository implements IRoleRepository {
  async getDefault(): Promise<IRole | null> {
    return await Role.findOne({ name: "user" }).exec();
  }
  async findById(id: string): Promise<IRole | null> {
    return await Role.findById(id).exec();
  }
  async getByName(name: string): Promise<IRole | null> {
    return await Role.findOne({ name }).exec();
  }
  async bulkCreate (roles: createRolesDTO[]): Promise<IRole[]> {
    const createdRoles = await Role.insertMany(roles, { ordered: false })
    return createdRoles as unknown as IRole[]
  }
}
