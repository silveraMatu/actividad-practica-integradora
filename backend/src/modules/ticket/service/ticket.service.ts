import { NotFoundError } from "../../../common/errors/appError.js";
import { IUserRepository } from "../../user/repository/user.repository.types.js";
import type {
  ITicketRepository,
  CreateTicketDTO,
} from "../repository/ticket.repository.types.js";
import {
  type Iticket,
  TicketStatus,
} from "../ticket.model.js";
import { IticketService } from "./ticket.service.types.js";

export class TicketService implements IticketService {
  //inyectamos dependencia por constructor
  constructor(
    private readonly ticketRepo: ITicketRepository,
    private readonly userRepo: IUserRepository)
  { }

  async createTicket(data: CreateTicketDTO): Promise<Iticket> {
    const { title, description, ownerId }: CreateTicketDTO = data;
    const userExist = await this.userRepo.findById(ownerId)

    if (!userExist) {
      throw new NotFoundError("No se encontro el usuario");
    }
    
    return await this.ticketRepo.create({title, description, ownerId});
  }

  async getAllTickets(): Promise<Iticket[]> {
    const tickets = await this.ticketRepo.findAll();
    if (!tickets.length) {
      throw new NotFoundError("No se encontraron tickets");
    }
    return tickets;
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
    // const previusStatus = ticket.status;

    const updateTicket = await this.ticketRepo.updateStatus(id, newStatus);
    if (!updateTicket) {
      throw new Error("Error al actualizar el ticket");
    }

    // if(previusStatus === newStatus){
    //   return updateTicket;
    // }
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
