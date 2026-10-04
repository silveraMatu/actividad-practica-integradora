import { Types } from "mongoose";
import { iUser } from "../user.model.js";
import { IRole } from "../../roles/role.model.js";
import { createUserDTO, userResponseDTO } from "../dto/user.dto.js";

// export interface IUserCreate {
//   name: string;
//   email: string;
//   password: string;
//   rol: Types.ObjectId;
// }

export interface IUserWithRol extends Omit<iUser, "rol"> {
  rol: Pick<IRole, "name">;
}


export interface IUserRepository {
  create(data: createUserDTO): Promise<iUser>;
  findByEmail(email: string): Promise<iUser | null>;
  findByEmailWIthRol(email: string): Promise<IUserWithRol | null>;
  findById(id: string): Promise<iUser | null>;
}