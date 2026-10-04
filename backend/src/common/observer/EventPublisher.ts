import { IObserver } from "./IObserver.js";
import { ISubject } from "./Isubject.js";
import { TicketStatusChangedEvent } from "./ticketStatusChangedEvent.js";

//clase que se inyectara por constructor a los observers para
// que puedan notificar a los observers cuando se produzca un cambio de estado en un ticket
export class EventPublisher implements ISubject{
  observers: IObserver[] = []
  
  attach(observer: IObserver): void {
    console.log("attaching observer", observer)
    const isExist = this.observers.includes(observer)
    if (!isExist)
      this.observers.push(observer)
  }

  detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex !== -1)
      this.observers.splice(observerIndex, 1)
  }

  async notify(event: TicketStatusChangedEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(event)
    }
  }
}