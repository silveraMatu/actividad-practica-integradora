import { hash } from "./helpers/bcrypt.js";
import type { IAuthRepository, IPublicUser, IUserCreate } from "./interfaces/IAuthRepository.js";
import type { createUserDTO, IAuthService, IUserLogin } from "./interfaces/IAuthService.js";




export class AuthService implements IAuthService{
    constructor(private readonly authRepository: IAuthRepository){}

    async create(data: createUserDTO): Promise<IPublicUser> {
        const {name, email, password, roles} = data

        const passwordHash = await hash(password)

        const user = await this.authRepository.create({name, email, password: passwordHash, roles})
        return user
    }

    async getByEmail(email: string): Promise<IPublicUser | null> {
        const user =  this.authRepository.getByEmail(email)
        if(!user)
            throw new Error("Credenciales inválidas")
        return user
    }

    async login(data: IUserLogin):Promise<IPublicUser | null >{
        const user = await this.getByEmail(data.email)


        //logica para ver si la contraseña esta bien, emitir token, etc

        return user

    }
    
}