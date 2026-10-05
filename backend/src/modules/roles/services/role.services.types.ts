import { roleResponseDTO } from "../role.dto.js"

export interface IRoleService {
  findAll(): Promise<roleResponseDTO[]>
}
