import { IObserver } from "../../common/observer/IObserver.js";
import { TicketStatusChangedEvent } from "../../common/observer/ticketStatusChangedEvent.js";
import { ISubscriptionRepository } from "../subscriptions/repository/subscriptions.repository.types.js";

export class NotificationService implements IObserver {
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository
  )
  { }
  async update(event: TicketStatusChangedEvent): Promise<void> {
      const subscriptions = await this.subscriptionRepo.findAllSubscriptionsByTicket(event.ticketId)
      if(!subscriptions.length) return
      for(const subscription of subscriptions) {
        //logica para enviar notificacione
      }
  }
}