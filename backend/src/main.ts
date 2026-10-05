import "./common/config/env.js";
import { db } from "./common/database/index.js";
import { createApp } from "./app.js";
import { createRouter } from "./modules/routes.js";

import { EventPublisher } from "./common/observer/EventPublisher.js";
import { bcryptService } from "./common/security/hasher/bcrypt.js";

import { UserRepository } from "./modules/user/repository/user.repository.js";
import { RoleRepository } from "./modules/roles/role.repository.js";
import { TicketRepository } from "./modules/ticket/repository/ticket.repository.js";
import { SubscriptionRepository } from "./modules/subscriptions/repository/subscriptions.repository.js";
import { NotificationRepository } from "./modules/notifications/repository/notification.repository.js";

import { AuthService } from "./modules/auth/services/auth.service.js";
import { UserService } from "./modules/user/services/user.services.js";
import { TicketService } from "./modules/ticket/service/ticket.service.js";
import { SubscriptionService } from "./modules/subscriptions/services/subscription.service.js";
import { NotificationService } from "./modules/notifications/services/notification.service.js";

import { AuthController } from "./modules/auth/auth.controller.js";
import { UserController } from "./modules/user/user.controller.js";
import { TicketController } from "./modules/ticket/ticket.controller.js";
import { SubscriptionController } from "./modules/subscriptions/subscription.controller.js";
import { NotificationController } from "./modules/notifications/notification.controller.js";

import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { createUserRouter } from "./modules/user/user.routes.js";
import { createTicketRouter } from "./modules/ticket/ticket.routes.js";
import { createSubscriptionRouter } from "./modules/subscriptions/subscription.routes.js";
import { createNotificationRouter } from "./modules/notifications/notification.routes.js";

const port = process.env.PORT || 3000;

async function main() {
  await db.connect(process.env.MONGO_URI!, {
    dbName: process.env.MONGO_DB_NAME!,
  });

  const userRepo = new UserRepository();
  const roleRepo = new RoleRepository();
  const ticketRepo = new TicketRepository();
  const subscriptionRepo = new SubscriptionRepository();
  const notificationRepo = new NotificationRepository();
  const hasher = new bcryptService();

  const eventPublisher = new EventPublisher();

  const authService = new AuthService(userRepo, roleRepo, hasher);
  const userService = new UserService(userRepo, roleRepo);
  const ticketService = new TicketService(ticketRepo, userRepo, subscriptionRepo, eventPublisher);
  const subscriptionService = new SubscriptionService(subscriptionRepo, ticketRepo);
  const notificationService = new NotificationService(subscriptionRepo, notificationRepo);

  eventPublisher.attach(notificationService);

  const authController = new AuthController(authService);
  const userController = new UserController(userService);
  const ticketController = new TicketController(ticketService);
  const subscriptionController = new SubscriptionController(subscriptionService);
  const notificationController = new NotificationController(notificationService);

  const apiRouter = createRouter({
    authRouter: createAuthRouter(authController),
    userRouter: createUserRouter(userController),
    ticketRouter: createTicketRouter(ticketController),
    subscriptionRouter: createSubscriptionRouter(subscriptionController),
    notificationRouter: createNotificationRouter(notificationController),
  });

  const app = createApp(apiRouter);

  app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
  });
}

await main();
