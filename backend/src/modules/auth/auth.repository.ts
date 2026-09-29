import { User, type iUser } from "../../database/entities/user.js";
import type { IAuthRepository, IUserCreate, IUserWithRoles } from "./interfaces/IAuthRepository.js";

export class AuthRepository implements IAuthRepository{
    async create(data: IUserCreate): Promise<iUser> {
        const user = new User(data)
        await user.save()
        return user
    }

    async getByEmail(email: string): Promise<iUser | null> {
        const user =  await User.findOne({email}).exec()
        return user
    }

    async getByEmailWIthRoles (email: string):Promise<IUserWithRoles | null>{
        return User.findOne({email})
        .populate('roles', 'name')
        .select("name")
        .lean<IUserWithRoles>()
        .exec() 
    }

}   