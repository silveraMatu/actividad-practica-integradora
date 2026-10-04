import { Types } from "mongoose";

export interface CreateSubscriptionDTO {
  userId: Types.ObjectId;
  ticketId: Types.ObjectId;
}