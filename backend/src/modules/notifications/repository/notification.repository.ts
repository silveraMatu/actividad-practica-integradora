import { INotificationDTO } from "../dto/notification.dto.js";
import { INotification, Notification } from "../notification.model.js";
import { INotificationRepository } from "./notification.repository.types.js";

export class NotificationRepository implements INotificationRepository {
  async create(notification: INotificationDTO): Promise<INotification> {
    return await Notification.create(notification);
  }

  async findAllByUser(userId: string): Promise<INotification[]> {
    return await Notification.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findNotReadByUser(userId: string): Promise<INotification[]> {
    return await Notification.find({ userId, read: false }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(notificationId: string): Promise<void> {
    await Notification.findByIdAndUpdate(notificationId, { read: true }).exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany({ userId, read: false }, { read: true }).exec();
  }
}