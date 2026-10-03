import { IObserver } from "./IObserver.js"
import { TicketStatusChangedEvent } from "./ticketStatusChangedEvent.js"

export interface ISubject{
  attach(o: IObserver): void
  detach(o: IObserver): void
  notify(event: TicketStatusChangedEvent): Promise<void>
}