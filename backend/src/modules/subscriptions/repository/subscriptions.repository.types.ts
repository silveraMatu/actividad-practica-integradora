import { iUser } from "../../user/user.model.js";
import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";
import { ISubscription } from "../subscription.model.js";

interface Subscription{
  userId: string;
  ticketId: string;
}


export interface IsubscriptionPopulated extends Omit<Subscription, "userId"> {
  userId: iUser;
}


export interface ISubscriptionRepository {
  create(subscription: CreateSubscriptionDTO): Promise<ISubscription>;
  delete(subscriptionId: string): Promise<void>;
  deleteAllByTicket(ticketId: string): Promise<void>;
  findAllSubscriptionsByTicket(ticketId: string): Promise<IsubscriptionPopulated[]>;
  findAllSubscriptionsByUser(userId: string): Promise<ISubscription[]>;
  findOne(userId: string, ticketId: string): Promise<ISubscription | null>;
  findOneById(subscriptionId: string): Promise<ISubscription | null>;
}