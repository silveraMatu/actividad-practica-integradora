export type Rol = "admin" | "operator" | "user";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  rol: Rol;
}

export interface Role {
  _id: string;
  name: Rol;
}

export type TicketStatus = "ABIERTO" | "EN_PROGRESO" | "RESUELTO" | "CERRADO";

export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: TicketStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  // GET /subscription/me devuelve ticketId poblado (populate de Mongoose),
  // no el id como string.
  ticketId: Ticket;
}

export interface Notification {
  // El backend devuelve `id`, no `_id`, y nunca expone el campo `read`
  // en este DTO (solo existe internamente para filtrar /unread).
  id: string;
  userId: string;
  ticketId: string;
  message: string;
  createdAt: string;
}
