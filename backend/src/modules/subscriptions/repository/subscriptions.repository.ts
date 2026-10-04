import { ISubscription, Subscription } from "../subscription.model.js";
import { ISubscriptionRepository } from "./subscriptions.repository.types.js";
import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(subscription: CreateSubscriptionDTO): Promise<ISubscription> {
    const newSubscription = new Subscription(subscription);
    await newSubscription.save();
    return newSubscription;
  }

  async delete(subscriptionId: string): Promise<void> {
    await Subscription.findByIdAndDelete(subscriptionId).exec();
  }

  async findAllSubscriptionsByUser(userId: string): Promise<ISubscription[]> {
    return await Subscription
      .find({ userId })
      .populate("ticketId")
      .exec();
  }

  async findAllSubscriptionsByTicket(ticketId: string): Promise<ISubscription[]> {
    return await Subscription.find({ ticketId }).exec();
    //se pule despues
  }
  
}