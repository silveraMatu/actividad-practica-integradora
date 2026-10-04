import { Types } from "mongoose";
import { ISubscription, Subscription } from "../subscription.model.js";
import { ISubscriberView, ISubscriptionRepository } from "./subscriptions.repository.types.js";
import { CreateSubscriptionDTO } from "../dto/subscription.dto.js";
import { iUser } from "../../user/user.model.js";

type LeanSubscriptionWithUser = {
  _id: Types.ObjectId;
  ticketId: Types.ObjectId;
  userId: iUser;
};

export class SubscriptionRepository implements ISubscriptionRepository {
  async create(subscription: CreateSubscriptionDTO): Promise<ISubscription> {
    const newSubscription = new Subscription(subscription);
    await newSubscription.save();
    return newSubscription;
  }

  async delete(subscriptionId: string): Promise<void> {
    await Subscription.findByIdAndDelete(subscriptionId).exec();
  }

  async deleteAllByTicket(ticketId: string): Promise<void> {
    await Subscription.deleteMany({ ticketId }).exec();
  }

  async findAllSubscriptionsByUser(userId: string): Promise<ISubscription[]> {
    return await Subscription
      .find({ userId })
      .populate("ticketId")
      .exec();
  }

  async findAllSubscriptionsByTicket(ticketId: string): Promise<ISubscriberView[]> {
    const subscriptions = await Subscription
      .find({ ticketId })
      .populate("userId")
      .lean<LeanSubscriptionWithUser[]>()
      .exec();

    return subscriptions.map((sub) => ({
      _id: sub._id.toString(),
      ticketId: sub.ticketId.toString(),
      user: {
        id: sub.userId._id.toString(),
        name: sub.userId.name,
        email: sub.userId.email,
      },
    }));
  }

  async findOne(userId: string, ticketId: string): Promise<ISubscription | null> {
    return await Subscription.findOne({ userId, ticketId }).exec();
  }

  async findOneById(subscriptionId: string): Promise<ISubscription | null> {
    return await Subscription.findById(subscriptionId).exec();
  }
  
}