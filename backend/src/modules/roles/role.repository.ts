import { Role, type IRole  } from "../../database/entities/role.js"

export interface IRoleRepository{
    getByName(name: string): Promise<IRole | null >
    getByNames(names: string[]): Promise<IRole[]>
    getDefault():Promise<IRole | null>
}

export class RoleRepository implements IRoleRepository{
    async getByName(name: string): Promise<IRole | null> {
        return await Role.findOne({name}).exec()
    }

    async getByNames(names: string[]): Promise<IRole[]> {
        return Role.find({name: {$in: names}}).lean().exec()
    }

    async getDefault(): Promise<IRole | null> {
        return await Role.findOne({name: "user"}).exec()
    }
}