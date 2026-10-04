import { ISubscriptionRepository } from "../repository/subscriptions.repository.types.js";
import { ISubscriptionService } from "./subscription.service.types.js";
import { IUserRepository } from "../../user/repository/user.repository.types.js";
import { ITicketRepository } from "../../ticket/repository/ticket.repository.types.js";
import { ISubscription } from "../subscription.model.js";
import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";
import { ConflictError, NotFoundError } from "../../../common/errors/appError.js";


export class SubscriptionService implements ISubscriptionService { 
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly userRepo: IUserRepository,
    private readonly ticketRepo: ITicketRepository,
  )
  { }

  async createSubscription(subscription: CreateSubscriptionDTO): Promise<ISubscription> {
    const { userId, ticketId }: CreateSubscriptionDTO = subscription
    
    const ticket = await this.ticketRepo.findById(ticketId.toString());
    if (!ticket)
      throw new NotFoundError("Ticket no encontrado")

    const subscriptionExists = await this.subscriptionRepo.findOne(userId, ticketId);
    if (subscriptionExists)
      throw new ConflictError("Ya estás suscrito a este ticket")

    const newSubscription = await this.subscriptionRepo.create({
      userId: userId,
      ticketId: ticket._id.toString(),
    })

    return newSubscription
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    await this.subscriptionRepo.delete(subscriptionId);
  }

  async findSubscriptionsByUser(userId: string): Promise<ISubscription[]> {
    const subscriptions = await this.subscriptionRepo.findAllSubscriptionsByUser(userId);
    if (!subscriptions)
      throw new NotFoundError("No se encontraron suscripciones")
    
    return subscriptions
  }

  async findSubscriptionsByTicket(ticketId: string): Promise<ISubscription[]> {
    const subscriptions = await this.subscriptionRepo.findAllSubscriptionsByTicket(ticketId);
    if (!subscriptions)
      throw new NotFoundError("No se encontraron suscripciones")
    
    return subscriptions
  }
}