import type { IPublicUser, IUserCreate } from "./IAuthRepository.js"

export type IUserLogin = Pick<IUserCreate, "email" | "password">

export interface IAuthService { 
    create(data: IUserCreate): Promise<IPublicUser>
    getByEmail(email: string): Promise<IPublicUser | null >
    login(data: IUserLogin): Promise<IPublicUser | null >
}
