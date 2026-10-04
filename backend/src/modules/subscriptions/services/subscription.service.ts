import { IsubscriptionPopulated, ISubscriptionRepository } from "../repository/subscriptions.repository.types.js";
import { ISubscriptionService } from "./subscription.service.types.js";
import { ITicketRepository } from "../../ticket/repository/ticket.repository.types.js";
import { ISubscription } from "../subscription.model.js";
import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../../common/errors/appError.js";

export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly ticketRepo: ITicketRepository,
  )
  { }

  async createSubscription(subscription: CreateSubscriptionDTO): Promise<ISubscription> {
    const { userId, ticketId }: CreateSubscriptionDTO = subscription

    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket)
      throw new NotFoundError("Ticket no encontrado")

    //evitar q el owner se suscriba a su propio ticket
    if (ticket.ownerId.equals(userId))
      throw new ConflictError("No puedes suscribirte a tu propio ticket")

    //evitar q un user se suscriba al mismo ticket
    const subscriptionExists = await this.subscriptionRepo.findOne(userId, ticketId);
    if (subscriptionExists)
      throw new ConflictError("Ya estás suscrito a este ticket")

    try {
      const newSubscription = await this.subscriptionRepo.create({
        userId: userId,
        ticketId: ticket._id.toString(),
      })

      return newSubscription
    } catch (err: any) {
      if (err?.code === 11000)
        throw new ConflictError("Ya estás suscrito a este ticket")
      throw err
    }
  }

  async deleteSubscription(userId: string, subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionRepo.findOneById(subscriptionId);
    if (!subscription)
      throw new NotFoundError("Suscripción no encontrada")

    if (!subscription.userId.equals(userId))
      throw new ForbiddenError("No tienes permiso para eliminar esta suscripción")

    await this.subscriptionRepo.delete(subscriptionId);
  }

  async findSubscriptionsByUser(userId: string): Promise<ISubscription[]> {
    return await this.subscriptionRepo.findAllSubscriptionsByUser(userId);
  }

  async findSubscriptionsByTicket(ticketId: string): Promise<IsubscriptionPopulated[]> {
    return await this.subscriptionRepo.findAllSubscriptionsByTicket(ticketId);
  }
}
