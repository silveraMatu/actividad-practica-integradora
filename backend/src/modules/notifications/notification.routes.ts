import { Router } from "express";
import { authMiddleware as auth } from "../../common/middlewares/auth.middleware.js";
import { requireRole as role } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.js";
import { NotificationController } from "./notification.controller.js";
import { markAsReadValidator } from "./notification.validator.js";

export function createNotificationRouter(notificationController: NotificationController): Router {
  const notificationRouter = Router();

  notificationRouter.get("/",
    auth,
    role("admin", "operator", "user"),
    notificationController.getAll
  );

  notificationRouter.get("/unread",
    auth,
    role("admin", "operator", "user"),
    notificationController.getUnread
  );

  notificationRouter.patch("/read-all",
    auth,
    role("admin", "operator", "user"),
    notificationController.markAllAsRead
  );

  notificationRouter.patch("/:id/read",
    auth,
    role("admin", "operator", "user"),
    markAsReadValidator,
    validate,
    notificationController.markAsRead
  );

  return notificationRouter;
}
