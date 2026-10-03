import  type {  Request, Response } from 'express'
import { TicketService } from './service/ticket.service.js'
import { TicketStatus } from './ticket.entity.js'

export class TicketController {
    //inyectamos el servicio por constructor
    constructor( 
        private ticketService: TicketService
    ) {}

    create = async ( req: Request, res: Response ): Promise<void> => {
        try {
            const { title, description, userId } = req.body
            
            //llamamos al servicio 
            const newTicket = await this.ticketService.createTicket({ title, description, userId })
            
            //respomdemos con http de recurso creado
            // res.status(400).json({ message: error.message });
        } catch (error) {
            
        }
    } 

    getAll = 
}