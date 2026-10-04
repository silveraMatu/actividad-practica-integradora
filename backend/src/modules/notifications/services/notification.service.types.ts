import { IObserver } from "../../../common/observer/IObserver.js";
import { CreateNotificationDTO, INotificationResponse } from "../dto/notification.dto.js";

export interface INotificationService extends IObserver{
  createNotification(notification: CreateNotificationDTO): Promise<void>;
  getNotifications(userId: string): Promise<INotificationResponse[]>;
  getNotReadNotifications(userId: string): Promise<INotificationResponse[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}