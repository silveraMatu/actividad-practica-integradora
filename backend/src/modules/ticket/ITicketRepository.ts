
import {type Iticket, TicketStatus } from '../../database/entities/ticket.js'

export interface CreateTicketDTO {
    title: string, 
    description: string,
    userId: string
}

export interface ITicketRepository {
    //crea un nuevo ticket en la bd
    create( data: CreateTicketDTO ): Promise<Iticket>;

    findById( id: string): Promise<Iticket | null>;

    findAll(): Promise<Iticket[]>;

    updateStatus( id: string, status: TicketStatus ): Promise<Iticket | null>

    delete( id: string ): Promise<boolean>
}