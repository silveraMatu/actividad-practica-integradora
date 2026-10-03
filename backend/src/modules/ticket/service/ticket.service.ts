import { NotFoundError } from "../../../core/errors/appError.js";
import type {
  ITicketRepository,
  CreateTicketDTO,
} from "../repository/ticket.repository.types.js";
import {
  type Iticket,
  TicketStatus,
} from "../ticket.entity.js";
import { IticketService } from "./ticket.service.types.js";

export class TicketService implements IticketService {
  //inyectamos dependencia por constructor
  constructor(private ticketRepo: ITicketRepository) {}

  async createTicket(data: CreateTicketDTO): Promise<Iticket> {
    const {title, description, userId}:CreateTicketDTO = data;
    return await this.ticketRepo.create({title, description, userId});
  }

  async getAllTickets(): Promise<Iticket[]> {
    return await this.ticketRepo.findAll();
  }

  async getTicketById(id: string): Promise<Iticket | null> {
    const ticket = await this.ticketRepo.findById(id);
    if (!ticket) {
      throw new NotFoundError("No se encontro el ticket");
    }
    return ticket;
  }

  async changeStatus(id: string, newStatus: TicketStatus): Promise<Iticket> {
    const ticket = await this.getTicketById(id);

    const previusStatus = ticket!.status;

    const updateTicket = await this.ticketRepo.updateStatus(id, newStatus);
    if (!updateTicket) {
      throw new Error("Error al actualizar el ticket");
    }

    if(previusStatus === newStatus){
      return updateTicket;
    }
    //logica de notificacion mediante notification service
    return updateTicket;
  }

  async deleteTicket(id: string): Promise<boolean> {
    await this.getTicketById(id);

    const deleted = await this.ticketRepo.delete(id);
    if (!deleted) {
      throw new Error("Error al eliminar el ticket");
    }

    return deleted;
  }
}
