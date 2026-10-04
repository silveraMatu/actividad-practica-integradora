import { ISubscription, Subscription } from "../subscription.model.js";
import { ISubscriptionsRepository } from "./subscriptions.repository.types.js";

export class SubscriptionsRepository implements ISubscriptionsRepository {
  async create(subscription: ISubscription): Promise<ISubscription> {
    const newSubscription = new Subscription(subscription);
    await newSubscription.save();
    return newSubscription;
  }

  async delete(subscriptionId: string): Promise<void> {
    await Subscription.findByIdAndDelete(subscriptionId).exec();
  }

  async findAllSubscriptionsByUser(userId: string): Promise<ISubscription[]> {
    return await Subscription.find({ userId }).exec();
  }

  async findAllSubscriptionsByTask(taskId: string): Promise<ISubscription[]> {
    return await Subscription.find({ ticketId: taskId }).exec();
  }
  
}