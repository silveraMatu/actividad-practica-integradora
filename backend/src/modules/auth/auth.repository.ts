import { User } from "../../database/entities/user.js";
import type { IAuthRepository, IPublicUser, IUserCreate } from "./interfaces/IAuthRepository.js";

export class AuthRepository implements IAuthRepository{
    async create(data: IUserCreate): Promise<void> {
        const user = new User(data)
        await user.save()
    }

    async getByEmail(email: string): Promise<IPublicUser | null> {
        return await User.findOne({$where: {email: email}})
    }
}