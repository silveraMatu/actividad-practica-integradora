import { Router } from "express";
import { authMiddleware as auth } from "../../common/middlewares/auth.middleware.js";
import { requireRole as role } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.js";
import { NotificationRepository } from "./repository/notification.repository.js";
import { SubscriptionRepository } from "../subscriptions/repository/subscriptions.repository.js";
import { NotificationService } from "./services/notification.service.js";
import { NotificationController } from "./notification.controller.js";
import { markAsReadValidator } from "./notification.validator.js";

export const notificationRouter = Router();

const notificationRepo = new NotificationRepository();
const subscriptionRepo = new SubscriptionRepository();
const notificationService = new NotificationService(subscriptionRepo, notificationRepo);
const notificationController = new NotificationController(notificationService);

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
