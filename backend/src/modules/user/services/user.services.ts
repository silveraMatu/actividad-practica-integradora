import { NotFoundError } from "../../../common/errors/appError.js";
import { IUserRepository, IUserWithRol } from "../repository/user.repository.types.js";
import { IRoleRepository } from "../../roles/role.repository.js";
import { userResponseDTO } from "../dto/user.dto.js";
import { IUserService } from "./user.services.types.js";

function toResponse(user: IUserWithRol): userResponseDTO {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    rol: user.rol.name,
  };
}

export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
  )
  {}

  async findAll(): Promise<userResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(toResponse);
  }

  async assignRole(userId: string, roleId: string): Promise<userResponseDTO> {
    const role = await this.roleRepository.findById(roleId);
    if (!role)
      throw new NotFoundError("Rol no encontrado");

    const user = await this.userRepository.assignRole(userId, roleId);
    if (!user)
      throw new NotFoundError("Usuario no encontrado");

    return toResponse(user);
  }

}