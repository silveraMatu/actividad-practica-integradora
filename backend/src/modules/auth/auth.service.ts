import { Types } from "mongoose";
import { comparePassword, hash } from "./helpers/bcrypt.js";
import type { IAuthRepository, IPublicUser, IPublicUserLogin } from "./interfaces/IAuthRepository.js";
import type { createUserDTO, IAuthService, IUserLogin } from "./interfaces/IAuthService.js";
import { createToken } from "./helpers/jwt.js";
import { type iUser } from "../../database/entities/user.js";
import type { IRoleRepository } from "../roles/role.repository.js";


export class AuthService implements IAuthService{
    constructor(
        private readonly authRepository: IAuthRepository,
        private readonly roleRepository: IRoleRepository
        ){}

    async create(data: createUserDTO): Promise<IPublicUser> {
        const {name, email, password, roles} = data

        //validacion de roles
        let rolesObjectId: Types.ObjectId[] = []

        if(roles && roles.length > 0){
            const formatedRoles = roles.map(rol => rol.toLowerCase())

            const foundRoles = await this.roleRepository.getByNames(formatedRoles)

            if(foundRoles.length < 0)
                throw new Error("Ninguno de los roles especificados es válido")

            rolesObjectId = foundRoles.map(role => role._id as Types.ObjectId)
            
        }else{
            const defaultRole = await this.roleRepository.getDefault()
            if(!defaultRole)
                throw new Error("El rol por defecto 'user' no está configurado en la base de datos.")
            rolesObjectId = [defaultRole._id as Types.ObjectId]
        }
       
        //validacion del mail
        const emailExist = await this.getByEmail(email.toLowerCase())
        if(emailExist)
            throw new Error("Este email ya se encuentra en uso")

        //hashing
        const passwordHash = await hash(password)

        const user = await this.authRepository.create({name, email, password: passwordHash, roles: rolesObjectId})
        return user
    }

    async getByEmail(email: string): Promise<iUser | null> {
        const user =  this.authRepository.getByEmail(email)
        if(!user)
            throw new Error("Credenciales inválidas")
        return user
    }

    async login(data: IUserLogin):Promise<IPublicUserLogin | null >{
        const user = await this.authRepository.getByEmailWIthRoles(data.email)

        //logica para ver si la contraseña esta bien, emitir token, etc
        const passwordCorrect = await comparePassword(data.password, user!.password)
        if(!passwordCorrect){
            throw new Error("Credenciales inválidas")
        }

        //obtener el rol
        const rolesName = user!.roles

        const token = createToken(user!._id.toString(),  rolesName)

        const payload = {
            ...user!.toObject(),
            token: token 
        }

        return payload
    }
    
}