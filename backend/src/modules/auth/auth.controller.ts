import type {Request, Response, NextFunction} from "express"
import type { IAuthService } from "./interfaces/IAuthService.js"

export class AuthController{
    constructor(private readonly authService: IAuthService){}
    register = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            await this.authService.create(req.body)
            res.status(201).json({
                status: "OK",
                statusCode: 201,
                message: "Usuario creado con éxito"
            })
        } catch (err) {
            next(err)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const user = await this.authService.login(req.body)

            res.cookie("token", user?.token)
            
            res.status(204)
        } catch (err) {
            next(err)
        }
    }

    logout = async (_req: Request, res: Response, next: NextFunction)=>{
        try {
            res.clearCookie("token")
        } catch (err) {
            next(err)
        }
    }
}