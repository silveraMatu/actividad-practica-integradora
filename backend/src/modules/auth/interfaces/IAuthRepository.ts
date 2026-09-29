export interface IUserCreate{
    name: string,
    email: string,
    password: string,
    roleId: string
}

export interface IPublicUser{
    id: string,
    name: string,
    email: string,
    roleId: string
}

export interface IAuthRepository { 
    create(data: IUserCreate): Promise<IPublicUser>
    getByEmail(email: string): Promise<IPublicUser | null >
}
