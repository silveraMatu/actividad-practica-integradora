import { INotificationResponse } from "../dto/notification.dto.js";
import { NotificationRepository } from "../repository/notification.repository.js";
import { INotificationRepository } from "../repository/notification.repository.types.js";

interface INotifier{
  send(notification: INotificationResponse): Promise<void>;
}

class inAppNotifier implements INotifier {
  constructor(private readonly notificationRepo: INotificationRepository) {}

  async send(notification: INotificationResponse): Promise<void> {
    try {
      await this.notificationRepo.create(notification);      
    } catch (err) {
      console.error(err);
    }
  }
}

class ConsoleNotifier {
  logNotification(type: string, to: string, ticketId: string, message: string) {
    console.log(`[${type.toUpperCase()}]\n to: ${to}\n ticketId: ${ticketId}\n message: ${message}`);
  }
}

//adapter para que ConsoleNotifier pueda ser utilizado como INotifier
class ConsoleNotifierAdapter implements INotifier {
  private readonly consoleNotifier: ConsoleNotifier
  
  constructor(consoleNotifier?: ConsoleNotifier) {
    this.consoleNotifier = consoleNotifier ?? new ConsoleNotifier();
  }
  async send(notification: INotificationResponse): Promise<void> {
    const { userId, ticketId, message } = notification;
    this.consoleNotifier.logNotification("notification", userId, ticketId, message);
  }
}

type NotifierType = "inapp" | "console"

export class NotifierFactory{
  static createNotifier(type: NotifierType): INotifier {
    switch (type) {
      case "inapp":
        return new inAppNotifier(new NotificationRepository());
      case "console":
        return new ConsoleNotifierAdapter();
      default:
        throw new Error(`Tipo de notificador desconocido: ${type}`);
    }
  }
} 