import type {
  ITicketRepository,
  CreateTicketDTO,
} from "./ITicketRepository.js";
import {
  type Iticket,
  TicketStatus,
} from "../../core/database/entities/ticket.js";

export class TicketService {
  //inyectamos dependencia por constructor
  constructor(private ticketRepo: ITicketRepository) {}

  async createTicket(data: CreateTicketDTO): Promise<Iticket> {
    return await this.ticketRepo.create(data);
  }

  async getAllTicket(): Promise<Iticket[]> {
    return await this.ticketRepo.findAll();
  }

  async getByIdTicket(id: string): Promise<Iticket> {
    const ticket = await this.ticketRepo.findById(id);
    if (!ticket) {
      throw new Error("No se encontro el ticket");
    }
    return ticket;
  }

  async changeStatus(id: string, newStatus: TicketStatus): Promise<Iticket> {
    //comprobamos si existe el ticket
    const ticket = await this.getByIdTicket(id);

    //guardamos el estado anterior para la notificacion
    const previusStatus = ticket.status;

    //aca cambiamos el estado en la bd usando el repositorio
    const updateTicket = await this.ticketRepo.updateStatus(id, newStatus);
    if (!updateTicket) {
      throw new Error("Error al actualizar el ticket");
    }
    return updateTicket;
  }
}
