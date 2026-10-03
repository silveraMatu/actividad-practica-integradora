import { IUserCreate, IUserWithRol } from "../repository/user.repository.types.js";
import { iUser, User } from "../user.entity.js";
import { IUserRepository } from "./user.repository.types.js";

export class UserRepository implements IUserRepository{
  async create(data: IUserCreate): Promise<iUser> {
    const user = new User(data);
    await user.save();
    return user;
  }

  async findByEmail(email: string): Promise<iUser | null> {
    const user = await User.findOne({email}).exec()
    return user ?? null
  }

  async findByEmailWIthRol(email: string): Promise<IUserWithRol | null> {
    const user = await User
    .findOne({email})
    .populate("rol", "name")
    .lean<IUserWithRol>()
    .exec() 

    return user ?? null
  }
}