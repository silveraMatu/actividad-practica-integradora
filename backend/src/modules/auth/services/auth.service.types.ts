import { createUserDTO, userResponseDTO } from "../../user/dto/user.dto.js";

export type IUserLogin = Pick<createUserDTO, "email" | "password">;

export interface IPublicUserLogin extends Omit<createUserDTO, "password"> {
  token: string;
}

export interface userWithToken extends userResponseDTO{
  token: string
}

export interface IAuthService {
  create(data: createUserDTO): Promise<userResponseDTO>;
  login(data: IUserLogin): Promise<userWithToken | null>;
}
