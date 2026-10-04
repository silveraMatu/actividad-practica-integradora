import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";
import { ISubscription } from "../subscription.model.js";

//vista de un suscriptor: no reutiliza "userId" para evitar que el mismo campo
//signifique "ObjectId crudo" en un metodo y "documento de usuario" en otro
export interface ISubscriberView {
  _id: string;
  ticketId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ISubscriptionRepository {
  create(subscription: CreateSubscriptionDTO): Promise<ISubscription>;
  delete(subscriptionId: string): Promise<void>;
  deleteAllByTicket(ticketId: string): Promise<void>;
  findAllSubscriptionsByTicket(ticketId: string): Promise<ISubscriberView[]>;
  findAllSubscriptionsByUser(userId: string): Promise<ISubscription[]>;
  findOne(userId: string, ticketId: string): Promise<ISubscription | null>;
  findOneById(subscriptionId: string): Promise<ISubscription | null>;
}