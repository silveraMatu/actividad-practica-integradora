import { Router } from "express";
import { TicketRepository } from "./repository/ticket.repository.js";
import { TicketService } from "./service/ticket.service.js";
import { TicketController } from "./ticket.controller.js";

export const ticketRouter = Router();

const ticketRepo = new TicketRepository();
const ticketService = new TicketService(ticketRepo);
const ticketController = new TicketController(ticketService);


ticketRouter.get("/", ticketController.getAll);
ticketRouter.post("/", ticketController.create);
ticketRouter.get("/:id", ticketController.getById);
ticketRouter.put("/:id", ticketController.changeStatus);
ticketRouter.delete("/:id", ticketController.delete);
