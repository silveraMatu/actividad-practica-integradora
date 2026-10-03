import { BadRequestError, UnauthorizedError } from "../../../core/errors/appError.js";
import { IPasswordHasher } from "../../../core/security/hasher/IPasswordHasher.js";
import { createToken } from "../../../core/security/jwt.js";
import type { IRoleRepository } from "../../roles/role.repository.js";
import { createUserDTO, userResponseDTO } from "../../user/dto/user.dto.js";
import { IUserRepository } from "../../user/repository/user.repository.types.js";
import { IAuthService, IUserLogin, userWithToken } from "./auth.service.types.js";

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly roleRepo: IRoleRepository,
    private readonly hasher: IPasswordHasher,
  ) {}

  async create(data: createUserDTO): Promise<userResponseDTO> {
    const { name, email, password } = data;

    //definir el rol por defecto de "usuario"
    const defaultRole = await this.roleRepo.getDefault();
    
    if (!defaultRole)
      throw new Error(
        "El rol por defecto 'usuario' no está configurado en la base de datos.",
      );
    
    const defaultRoleId = defaultRole!._id;
  
    const emailExist = await this.userRepo.findByEmail(email.toLowerCase());
    if (emailExist) throw new BadRequestError("Este email ya se encuentra en uso");

    const passwordHash = await this.hasher.hash(password);

    const user = await this.userRepo.create({
      name,
      email,
      password: passwordHash,
      rol: defaultRoleId,
    });

    const publicUser: userResponseDTO = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      rol: user.rol.toString()
    }

    return publicUser;
  }

  async login(data: IUserLogin): Promise<userWithToken | null> {
    const user = await this.userRepo.findByEmailWIthRol(data.email);

    if (!user) throw new UnauthorizedError("Credenciales inválidas");

    const passwordCorrect = await this.hasher.compare(data.password, user.password);

    if (!passwordCorrect) throw new Error("Credenciales inválidas");

    const rol = user.rol.name;

    const token = createToken(user!._id.toString(), rol);

    const publicUser: userWithToken = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      rol: user.rol.name,
      token: token
    }

    return publicUser;
  }
}
