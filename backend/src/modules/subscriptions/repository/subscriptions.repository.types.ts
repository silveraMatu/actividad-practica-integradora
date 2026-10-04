import { ISubscription } from "../subscription.model.js";

export interface ISubscriptionsRepository {
  create(subscription: ISubscription): Promise<ISubscription>;
  delete(subscriptionId: string): Promise<void>;
  findAllSubscriptionsByTask(taskId: string): Promise<ISubscription[]>;
  findAllSubscriptionsByUser(userId: string): Promise<ISubscription[]>;
}