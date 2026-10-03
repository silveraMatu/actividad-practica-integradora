import type { NextFunction, Request, Response } from "express";
import { TicketService } from "./service/ticket.service.js";
import { IticketService } from "./service/ticket.service.types.js";

export class TicketController {
  //inyectamos el servicio por constructor
  constructor(private ticketService: IticketService) {}

  create = async (req: Request, res: Response, next: NextFunction,): Promise<void> => {
    try {
      const newTicket = await this.ticketService.createTicket(req.body);

      //respomdemos con http de recurso creado
      res.status(201).json({
        status: "OK",
        statusCode: 201,
        message: "Ticket creado con éxito",
        data: newTicket,
      });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (_req: Request, res: Response, next: NextFunction,): Promise<void> => {
    try {
      const tickets = await this.ticketService.getAllTickets();

      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Tickets obtenidos con éxito",
        data: tickets,
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction,): Promise<void> => {
    try {
      const ticket = await this.ticketService.getTicketById(req.params.id!.toString());

      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Ticket obtenido con éxito",
        data: ticket,
      });
    }catch (err) {
      next(err);
    }
  }

  changeStatus = async (req: Request, res: Response, next: NextFunction,): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedTicket = await this.ticketService.changeStatus(id!.toString(), status);

      res.status(200).json({
        status: "OK",
        statusCode: 200,
        message: "Estado del ticket actualizado con éxito",
        data: updatedTicket,
      });
    } catch (err) {
      next(err);
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction,): Promise<void> => {
    try {
      const { id } = req.params;

      await this.ticketService.deleteTicket(id!.toString());

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
