import { TicketStatusChangedEvent } from "../../../common/observer/ticketStatusChangedEvent.js";
import { ISubscriptionRepository } from "../../subscriptions/repository/subscriptions.repository.types.js";
import { NotifierFactory } from "../factory/notification.factory.js";
import { INotificationService } from "./notification.service.types.js";

export class NotificationService implements Pick<INotificationService, "update"> { //Pick temporal para probar update
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository
  )
  { }
  async update(event: TicketStatusChangedEvent): Promise<void> {
    console.log(event)
    const subscriptions = await this.subscriptionRepo.findAllSubscriptionsByTicket(event.ticketId)
    console.log("subscriptions", subscriptions)
    if (!subscriptions.length) {
      return
    }
    
    const inAppNotifier = NotifierFactory.createNotifier("inapp")
    const consoleNotifier = NotifierFactory.createNotifier("console")
    
    for (const subscription of subscriptions) {
      const notification = {
        to: subscription.userId._id.toString(),
        ticketId: event.ticketId,
        message: `Ticket ${event.ticketTitle} ha cambiado de ${event.previousStatus} estado a ${event.newStatus}`,
      }

      const notificationConsole = {...notification, to: subscription.userId.email}
      
        //logica para enviar notificacione
        await inAppNotifier.send(notification)
        await consoleNotifier.send(notificationConsole)
      }
  }
}