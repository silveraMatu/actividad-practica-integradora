import type { Types } from "mongoose"
import type { IRole } from "../../../database/entities/role.js"
import type { iUser } from "../../../database/entities/user.js"

export interface IUserCreate{
    name: string,
    email: string,
    password: string,
    roles: Types.ObjectId[]
}

export interface IPublicUser{
    _id: Types.ObjectId,
    name: string,
    email: string,
    roles: Types.ObjectId[]
}

export interface IUserWithRoles extends Omit<iUser, "roles">{
    roles: Array<Pick<IRole, '_id' | 'name'>>
}

export interface IPublicUserLogin extends IPublicUser{
    token: string
}

export interface IAuthRepository { 
    create(data: IUserCreate): Promise<iUser>
    getByEmail(email: string): Promise<iUser | null >
    getByEmailWIthRoles(email: string): Promise<IUserWithRoles | null>
    getRolByName(rolesName: string[]):Promise<IRole[]>
}
