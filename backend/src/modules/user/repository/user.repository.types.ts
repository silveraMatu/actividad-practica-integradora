import { Types } from "mongoose";
import { iUser } from "../user.entity.js";
import { IRole } from "../../roles/role.entity.js";
import { userResponseDTO } from "../dto/user.dto.js";

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  rol: Types.ObjectId;
}

export interface IUserWithRol extends Omit<userResponseDTO, "rol"> {
  rol: Pick<IRole, "name">;
}


export interface IUserRepository {
  create(data: IUserCreate): Promise<iUser>;
  findByEmail(email: string): Promise<iUser | null>;
  findByEmailWIthRol(email: string): Promise<IUserWithRol | null>;
}