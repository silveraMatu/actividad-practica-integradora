import type { iUser } from "../../../database/entities/user.js";
import type { IPublicUser } from "./IAuthRepository.js"

export interface createUserDTO{
  name: string;
  email: string;
  password: string;
  roles?: string[];
}

export type IUserLogin = Pick<createUserDTO, "email" | "password">

export interface IAuthService { 
    create(data: createUserDTO ): Promise<IPublicUser>
    getByEmail(email: string): Promise<iUser | null >
    login(data: IUserLogin): Promise<IPublicUser | null >
}
