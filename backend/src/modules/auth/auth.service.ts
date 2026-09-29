import type { IAuthRepository, IPublicUser, IUserCreate } from "./interfaces/IAuthRepository.js";
import type { IAuthService, IUserLogin } from "./interfaces/IAuthService.js";

export class AuthService implements IAuthService{
    constructor(private readonly authRepository: IAuthRepository){}

    async create(data: IUserCreate): Promise<IPublicUser> {
        const {name, email, password, roleId} = data

        //hashing, asignacion del rol

        const user =  await this.authRepository.create({name, email, password, roleId})
        return user
    }

    async getByEmail(email: string): Promise<IPublicUser | null> {
        return await this.authRepository.getByEmail(email)
    }

    async login(data: IUserLogin):Promise<IPublicUser | null >{
        const user = await this.getByEmail(data.email)
        if(!user)
            throw new Error("Credenciales inválidas")

        //logica para ver si la contraseña esta bien, emitir token, etc
        
        return user

    }
    
}