import type { Types } from "mongoose"

export interface IUserCreate{
    name: string,
    email: string,
    password: string,
    roles: Types.ObjectId[]
}

export interface IPublicUser{
    id: string,
    name: string,
    email: string,
    roles: Types.ObjectId[]
}

export interface IAuthRepository { 
    create(data: IUserCreate): Promise<IPublicUser>
    getByEmail(email: string): Promise<IPublicUser | null >
}
