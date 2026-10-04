import { Document, model, Schema, Types } from "mongoose";

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  ticketId: Types.ObjectId;
}

const SubscriptionSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref:"User",
    required: true,
  },
  ticketId: {
    type: Types.ObjectId,
    ref: "Ticket",
    required: true
  },
})

//indice unico
SubscriptionSchema.index({ userId: 1, ticketId: 1 }, { unique: true })

export const Subscription = model<ISubscription>("Subscription", SubscriptionSchema);
