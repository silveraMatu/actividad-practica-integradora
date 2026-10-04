import { Types } from "mongoose";

export interface CreateSubscriptionDTO {
  userId: string;
  ticketId: string;
}