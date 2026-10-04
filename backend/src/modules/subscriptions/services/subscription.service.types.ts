import { ISubscription } from "../subscription.model.js";
import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";
import { IsubscriptionPopulated } from "../repository/subscriptions.repository.types.js";

export interface ISubscriptionService {
  createSubscription(subscription: CreateSubscriptionDTO): Promise<ISubscription>;
  deleteSubscription(userId: string, subscriptionId: string): Promise<void>;
  findSubscriptionsByUser(userId: string): Promise<ISubscription[]>;
  findSubscriptionsByTicket(ticketId: string): Promise<IsubscriptionPopulated[]>;
}