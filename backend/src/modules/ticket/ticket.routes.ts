import { Router } from "express";
import { TicketRepository } from "./repository/ticket.repository.js";
import { TicketService } from "./service/ticket.service.js";
import { TicketController } from "./ticket.controller.js";
import { changeTicketStatusValidation, createTicketValidations, deleteTicketValidation } from "./ticket.validations.js";
import { validate } from "../../common/middlewares/validate.js";
import { UserRepository } from "../user/repository/user.repository.js";
import { authMiddleware as auth } from "../../common/middlewares/auth.middleware.js";
import { requireRole as role } from "../../common/middlewares/role.middleware.js";

export const ticketRouter = Router();

const ticketRepo = new TicketRepository();
const userRepo = new UserRepository();
const ticketService = new TicketService(ticketRepo, userRepo);
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
