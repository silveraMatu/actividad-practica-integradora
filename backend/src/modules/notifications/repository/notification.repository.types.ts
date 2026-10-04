import { INotification } from "../notification.model.js";
import { INotificationDTO } from "../dto/notification.dto.js";

export interface INotificationRepository {
  create(notification: INotificationDTO): Promise<INotification>;
  findAllByUser(userId: string): Promise<INotification[]>;
  findNotReadByUser(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}