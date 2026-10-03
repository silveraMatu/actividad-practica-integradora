import { TicketStatusChangedEvent } from "./ticketStatusChangedEvent.js";

export interface IObserver{
  update(event: TicketStatusChangedEvent): Promise<void> | void
}