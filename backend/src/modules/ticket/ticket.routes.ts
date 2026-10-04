import { Router } from "express";
import { TicketRepository } from "./repository/ticket.repository.js";
import { TicketService } from "./service/ticket.service.js";
import { TicketController } from "./ticket.controller.js";
import { changeTicketStatusValidation, createTicketValidations, deleteTicketValidation } from "./ticket.validations.js";
import { validate } from "../../common/middlewares/validate.js";
import { UserRepository } from "../user/repository/user.repository.js";
import { SubscriptionRepository } from "../subscriptions/repository/subscriptions.repository.js";
import { authMiddleware as auth } from "../../common/middlewares/auth.middleware.js";
import { requireRole as role } from "../../common/middlewares/role.middleware.js";
import { EventPublisher } from "../../common/observer/EventPublisher.js";
import { NotificationService } from "../notifications/services/notification.service.js";
import { NotificationRepository } from "../notifications/repository/notification.repository.js";

export const ticketRouter = Router();


const ticketRepo = new TicketRepository();
const userRepo = new UserRepository();
const subscriptionRepo = new SubscriptionRepository();
const notificationRepo = new NotificationRepository();

// Temporal para probar observer
const eventPublisher = new EventPublisher();
const notificationService = new NotificationService(subscriptionRepo, notificationRepo);
eventPublisher.attach(notificationService)
//---------------------------------------------------

const ticketService = new TicketService(ticketRepo, userRepo, subscriptionRepo, eventPublisher);
const ticketController = new TicketController(ticketService);



ticketRouter.get("/",
  auth,
  role('admin', 'operator', 'user'),
  ticketController.getAll
);

ticketRouter.post("/",
  auth,
  role('admin', 'operator'),
  createTicketValidations,
  validate,
  ticketController.create
);

ticketRouter.get("/:id",
  auth,
  role('admin', 'operator', 'user'),
  ticketController.getById
);

ticketRouter.put("/change-status/:id",
  auth,
  role('admin', 'operator'),
  changeTicketStatusValidation,
  validate,
  ticketController.changeStatus
);

ticketRouter.delete("/:id",
  auth,
  role('admin'),
  deleteTicketValidation,
  validate,
  ticketController.delete
);
