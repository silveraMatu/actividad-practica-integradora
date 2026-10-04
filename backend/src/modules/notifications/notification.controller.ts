import { Request, Response, NextFunction } from "express";
import { INotificationService } from "./services/notification.service.types.js";
import { authUserPayload } from "../../common/types/express.js";

export class NotificationController {
  constructor(
    private readonly notificationService: INotificationService
  )
  { }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId }: Pick<authUserPayload, "userId"> = req.user!
      const notifications = await this.notificationService.getNotifications(userId)
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: notifications
      })
    } catch (err) {
      next(err)
    }
  }

  getUnread = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId }: Pick<authUserPayload, "userId"> = req.user!
      const notifications = await this.notificationService.getNotReadNotifications(userId)
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        data: notifications
      })
    } catch (err) {
      next(err)
    }
  }

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notificationId = req.params.id!.toString()
      await this.notificationService.markAsRead(notificationId)
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Notificación marcada como leída"
      })
    } catch (err) {
      next(err)
    }
  }

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId }: Pick<authUserPayload, "userId"> = req.user!
      await this.notificationService.markAllAsRead(userId)
      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Notificaciones marcadas como leídas"
      })
    } catch (err) {
      next(err)
    }
  }
}
