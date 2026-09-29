import type { promises } from 'dns';import { Ticket, type Iticket, TicketStatus } from '../../database/entities/ticket.js'
import type { ITicketRepository, CreateTicketDTO } from './ITicketRepository.js'

export class TicketRepository implements ITicketRepository {
    async create( data: CreateTicketDTO ): Promise<Iticket > {
        return await Ticket.create(data)
    }

        async findById( id: string): Promise<Iticket | null> {
            return await Ticket.findById(id);
        }

        async findAll(): Promise<Iticket[]> {
            return await Ticket.find()
        }

        async updateStatus( id: string, status: TicketStatus ): Promise<Iticket | null> {
            return await Ticket.findByIdAndUpdate(
                id, 
                { status: status}, 
                { new: true });
        }

        async delete( id: string ): Promise<boolean> {
            const result = await Ticket.findByIdAndDelete(id);
            return result !== null 
        }
}