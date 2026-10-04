//create
export interface INotificationDTO {
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