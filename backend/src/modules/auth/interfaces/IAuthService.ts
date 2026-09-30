import { Types } from "mongoose";
import type { iUser } from "../../../database/entities/user.js";

export interface createUserDTO{
  name: string;
  email: string;
  password: string;
  roles?: string[];
}

export interface IPublicUser{
    _id: Types.ObjectId,
    name: string,
    email: string,
    roles: Types.ObjectId[]
}

export type IUserLogin = Pick<createUserDTO, "email" | "password">

export interface IPublicUserLogin extends Omit<createUserDTO, "password">{
    token: string
}

export interface IAuthService { 
    create(data: createUserDTO ): Promise<IPublicUser>
    getByEmail(email: string): Promise<iUser | null >
    login(data: IUserLogin): Promise<IPublicUserLogin | null >
}
