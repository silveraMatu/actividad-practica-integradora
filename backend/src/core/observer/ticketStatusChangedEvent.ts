export interface TicketStatusChangedEvent {
  ticketId: string;
  ticketTitle: string;
  previousStatus: string;
  newStatus: string;
  updatedAt: Date;
}