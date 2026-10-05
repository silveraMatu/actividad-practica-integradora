import { apiFetch } from "./client";
import type { Notification } from "../types";

interface NotificationListEnvelope {
  data: Notification[];
}

export async function getAll(): Promise<Notification[]> {
  const res = await apiFetch<NotificationListEnvelope>("/notifications/");
  return res.data;
}

export async function getUnread(): Promise<Notification[]> {
  const res = await apiFetch<NotificationListEnvelope>("/notifications/unread");
  return res.data;
}

export async function markAllRead(): Promise<void> {
  await apiFetch<void>("/notifications/read-all", { method: "PATCH" });
}

export async function markRead(id: string): Promise<void> {
  await apiFetch<void>(`/notifications/${id}/read`, { method: "PATCH" });
}
