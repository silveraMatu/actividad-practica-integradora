import { IRoleRepository } from "../role.repository.js";
import { roleResponseDTO } from "../role.dto.js";
import { IRoleService } from "./role.services.types.js";

export class RoleService implements IRoleService {
  constructor(private readonly roleRepository: IRoleRepository) {}

  async findAll(): Promise<roleResponseDTO[]> {
    const roles = await this.roleRepository.findAll();
    return roles.map((role) => ({
      _id: role._id!.toString(),
      name: role.name,
    }));
  }
}
