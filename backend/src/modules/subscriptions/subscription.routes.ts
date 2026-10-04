import { Router } from "express";
import { authMiddleware as auth} from "../../common/middlewares/auth.middleware.js";
import { requireRole as role } from "../../common/middlewares/role.middleware.js";
import { SubscriptionRepository } from "./repository/subscriptions.repository.js";
import { SubscriptionService } from "./services/subscription.service.js";
import { UserRepository } from "../user/repository/user.repository.js";
import { TicketRepository } from "../ticket/repository/ticket.repository.js";
import { SubscriptionController } from "./subscription.controller.js";
import { subscriptionValidator, deleteSubscriptionValidator } from "./subscription.validator.js";


export const subscriptionRouter = Router();

const subscriptionRepo = new SubscriptionRepository()
const userRepo = new UserRepository()
const ticketRepo = new TicketRepository()
const subscriptionService = new SubscriptionService(subscriptionRepo, userRepo, ticketRepo)
const subscriptionController = new SubscriptionController(subscriptionService)

subscriptionRouter.get("/me",
  auth,
  role("admin", "operator", "user"),
  //validaciones de express validator
  subscriptionController.getAllSubscriptionsByUserId
);

subscriptionRouter.post("/:ticketId",
  auth,
  role("admin", "operator", "user"),
  //validaciones de express validator
  subscriptionValidator,
  subscriptionController.create
);

subscriptionRouter.delete("/:id",
  auth,
  role("admin", "operator", "user"),
  //validaciones de express validator
  deleteSubscriptionValidator,
  subscriptionController.delete
);
