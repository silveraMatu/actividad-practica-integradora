import { Router } from "express";
import { TicketRepository } from "./repository/ticket.repository.js";
import { TicketService } from "./service/ticket.service.js";
import { TicketController } from "./ticket.controller.js";
import { changeTicketStatusValidation, createTicketValidations, deleteTicketValidation } from "./ticket.validations.js";
import { validate } from "../../core/middlewares/validate.js";
import { UserRepository } from "../user/repository/user.repository.js";

export const ticketRouter = Router();

const ticketRepo = new TicketRepository();
const userRepo = new UserRepository();
const ticketService = new TicketService(ticketRepo, userRepo);
const ticketController = new TicketController(ticketService);


ticketRouter.get("/",  ticketController.getAll);
ticketRouter.post("/", createTicketValidations, validate, ticketController.create);
ticketRouter.get("/:id", ticketController.getById);
ticketRouter.put("/:id", changeTicketStatusValidation, validate, ticketController.changeStatus);
ticketRouter.delete("/:id", deleteTicketValidation, validate, ticketController.delete);
