import { apiFetch, ApiError } from "./client";
import type { Ticket, TicketStatus } from "../types";

interface TicketEnvelope {
  data: Ticket;
}

interface TicketListEnvelope {
  data: Ticket[];
}

export async function getAll(): Promise<Ticket[]> {
  try {
    const res = await apiFetch<TicketListEnvelope>("/ticket/");
    return res.data;
  } catch (err) {
    // El backend responde 404 (no un array vacío) cuando no hay tickets.
    if (err instanceof ApiError && err.statusCode === 404) return [];
    throw err;
  }
}

export async function getById(id: string): Promise<Ticket> {
  const res = await apiFetch<TicketEnvelope>(`/ticket/${id}`);
  return res.data;
}

export async function create(title: string, description: string): Promise<Ticket> {
  const res = await apiFetch<TicketEnvelope>("/ticket/", { method: "POST", body: { title, description } });
  return res.data;
}

export async function changeStatus(id: string, status: TicketStatus): Promise<Ticket> {
  const res = await apiFetch<TicketEnvelope>(`/ticket/change-status/${id}`, { method: "PUT", body: { status } });
  return res.data;
}

export async function remove(id: string): Promise<void> {
  await apiFetch<void>(`/ticket/${id}`, { method: "DELETE" });
}
