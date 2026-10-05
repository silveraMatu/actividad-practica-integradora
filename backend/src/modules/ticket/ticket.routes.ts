import { Router } from "express";
import { TicketController } from "./ticket.controller.js";
import { changeTicketStatusValidation, createTicketValidations, deleteTicketValidation } from "./ticket.validations.js";
import { validate } from "../../common/middlewares/validate.js";
import { authMiddleware as auth } from "../../common/middlewares/auth.middleware.js";
import { requireRole as role } from "../../common/middlewares/role.middleware.js";

export function createTicketRouter(ticketController: TicketController): Router {
  const ticketRouter = Router();

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

  return ticketRouter;
}
