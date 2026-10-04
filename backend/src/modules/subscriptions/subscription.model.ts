import { Document, model, Schema, Types } from "mongoose";

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  ticketId: Types.ObjectId;
}

const SubcriptionSchema: Schema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    index: true,
  },
  ticketId: {
    type: Types.ObjectId,
    required: true,
    index: true,
  },
})

export const Subscription = model<ISubscription>("Subscription", SubcriptionSchema);
