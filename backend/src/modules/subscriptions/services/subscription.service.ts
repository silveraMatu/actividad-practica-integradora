import { ISubscriptionRepository } from "../repository/subscriptions.repository.types.js";
import { ISubscriptionService } from "./subscription.service.types.js";
import { IUserRepository } from "../../user/repository/user.repository.types.js";
import { ITicketRepository } from "../../ticket/repository/ticket.repository.types.js";
import { ISubscription } from "../subscription.model.js";
import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";
import { NotFoundError } from "../../../common/errors/appError.js";


export class SubscriptionServic implements ISubscriptionService { 
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly userRepo: IUserRepository,
    private readonly ticketRepo: ITicketRepository,
  )
  { }

  async createSubscription(subscription: CreateSubscriptionDTO): Promise<ISubscription> {
    
    const user = await this.userRepo.findById(subscription.userId);
    if (!user)
      throw new NotFoundError("Usuario no encontrado")

    const ticket = await this.ticketRepo.findById(subscription.ticketId);
    if (!ticket)
      throw new NotFoundError("Ticket no encontrado")

    const newSubscription = await this.subscriptionRepo.create({
      userId: user._id,
      ticketId: ticket._id,
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