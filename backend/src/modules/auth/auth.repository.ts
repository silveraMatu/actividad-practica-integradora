import { User } from "../../database/entities/user.js";
import type { IAuthRepository, IPublicUser, IUserCreate } from "./interfaces/IAuthRepository.js";

export class AuthRepository implements IAuthRepository{
    async create(data: IUserCreate): Promise<IPublicUser> {
        const user = new User(data)
        await user.save()
        const {password, ...publicUser} = user
        return publicUser 
    }

    async getByEmail(email: string): Promise<IPublicUser | null> {
        const user =  await User.findOne({$where: {email: email}})
        if(!user) return user
        const {password, ...publicUser} = user
        return publicUser
    }
}