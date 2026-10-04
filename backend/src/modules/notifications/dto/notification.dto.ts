export interface CreateNotificationDTO {
  userId: string;
  ticketId: string;
  message: string;
}

export interface INotificationResponse {
  id: string;
  userId: string;
  ticketId: string;
  message: string;
  createdAt: Date;
}