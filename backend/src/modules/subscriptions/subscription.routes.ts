import { Router } from "express";
import { authMiddleware as auth} from "../../common/middlewares/auth.middleware.js";
import { requireRole as role } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.js";
import { SubscriptionController } from "./subscription.controller.js";
import { subscriptionValidator, deleteSubscriptionValidator } from "./subscription.validator.js";

export function createSubscriptionRouter(subscriptionController: SubscriptionController): Router {
  const subscriptionRouter = Router();

  subscriptionRouter.get("/me",
    auth,
    role("admin", "operator", "user"),
    subscriptionController.getAllSubscriptionsByUserId
  );

  subscriptionRouter.post("/:ticketId",
    auth,
    role("admin", "operator", "user"),
    //validaciones de express validator
    subscriptionValidator,
    validate,
    subscriptionController.create
  );

  subscriptionRouter.delete("/:id",
    auth,
    role("admin", "operator", "user"),
    //validaciones de express validator
    deleteSubscriptionValidator,
    validate,
    subscriptionController.delete
  );

  return subscriptionRouter;
}
