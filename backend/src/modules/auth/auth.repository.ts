import { Role, type IRole } from "../../database/entities/role.js";
import { User, type iUser } from "../../database/entities/user.js";
import type { IAuthRepository, IPublicUser, IUserCreate, IUserWithRoles } from "./interfaces/IAuthRepository.js";

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
        .lean<IUserWithRoles>()
        .exec() 
    }

    async getRolByName(rolesName: string[]):Promise<IRole[]>{
        const role =  Role.find({name: {$in: rolesName}}).exec()
        return role
    }
}   