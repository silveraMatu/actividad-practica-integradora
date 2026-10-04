import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";
import { ISubscription } from "../subscription.model.js";

export interface ISubscriptionRepository {
  create(subscription: CreateSubscriptionDTO): Promise<ISubscription>;
  delete(subscriptionId: string): Promise<void>;
  deleteAllByTicket(ticketId: string): Promise<void>;
  findAllSubscriptionsByTicket(ticketId: string): Promise<ISubscription[]>;
  findAllSubscriptionsByUser(userId: string): Promise<ISubscription[]>;
  findOne(userId: string, ticketId: string): Promise<ISubscription | null>;
  findOneById(subscriptionId: string): Promise<ISubscription | null>;
}