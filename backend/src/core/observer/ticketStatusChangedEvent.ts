export interface TicketStatusChangedEvent {
  ticketId: string;
  ticketTitle: string;
  oldStatus: string;
  newStatus: string;
  updatedAt: Date;
}