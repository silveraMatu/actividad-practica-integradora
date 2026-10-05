import { userResponseDTO } from "../dto/user.dto.js"

export interface IUserService {
  assignRole(userId: string, roleId: string): Promise<userResponseDTO>
  findAll(): Promise<userResponseDTO[]>
}