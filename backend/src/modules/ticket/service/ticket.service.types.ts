import { CreateTicketDTO } from "../repository/ticket.repository.types.js";
import { Iticket, TicketStatus } from "../ticket.model.js";

export interface IticketService {
  createTicket(data: CreateTicketDTO): Promise<Iticket>;

  getTicketById(id: string): Promise<Iticket | null>;

  getAllTickets(): Promise<Iticket[]>;

  changeStatus(id: string, newStatus: TicketStatus): Promise<Iticket | null>;

  deleteTicket(id: string): Promise<boolean>;
}