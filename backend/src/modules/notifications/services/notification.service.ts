import { TicketStatusChangedEvent } from "../../../common/observer/ticketStatusChangedEvent.js";
import { ISubscriptionRepository } from "../../subscriptions/repository/subscriptions.repository.types.js";
import { NotifierFactory } from "../factory/notification.factory.js";
import { INotificationService } from "./notification.service.types.js";
import { INotificationRepository } from "../repository/notification.repository.types.js";
import { INotification } from "../notification.model.js";
import { CreateNotificationDTO, INotificationResponse } from "../dto/notification.dto.js";

function toResponse(notification: INotification): INotificationResponse {
  return {
    id: notification._id.toString(),
    userId: notification.userId.toString(),
    ticketId: notification.ticketId.toString(),
    message: notification.message,
    createdAt: notification.createdAt!,
  };
}

export class NotificationService implements INotificationService {
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly notificationRepo: INotificationRepository,
  )
  { }

  async createNotification(notification: CreateNotificationDTO): Promise<void> {
    await this.notificationRepo.create(notification);
  }

  async getNotifications(userId: string): Promise<INotificationResponse[]> {
    const notifications = await this.notificationRepo.findAllByUser(userId);
    return notifications.map(toResponse);
  }

  async getNotReadNotifications(userId: string): Promise<INotificationResponse[]> {
    const notifications = await this.notificationRepo.findNotReadByUser(userId);
    return notifications.map(toResponse);
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationRepo.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.markAllAsRead(userId);
  }

  async update(event: TicketStatusChangedEvent): Promise<void> {
    const subscriptions = await this.subscriptionRepo.findAllSubscriptionsByTicket(event.ticketId)
    if (!subscriptions.length) {
      return
    }
    
    const inAppNotifier = NotifierFactory.createNotifier("inapp")
    const consoleNotifier = NotifierFactory.createNotifier("console")
    
    for (const subscription of subscriptions) {
      const notification = {
        to: subscription.user.id,
        ticketId: event.ticketId,
        message: `Ticket ${event.ticketTitle} ha cambiado de ${event.previousStatus} estado a ${event.newStatus}`,
      }

      const notificationConsole = {...notification, to: subscription.user.email}
      
        //logica para enviar notificacione
        await inAppNotifier.send(notification)
        await consoleNotifier.send(notificationConsole)
      }
  }
}