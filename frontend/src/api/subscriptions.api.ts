import { apiFetch } from "./client";
import type { Subscription } from "../types";

interface SubscriptionListEnvelope {
  data: Subscription[];
}

export async function getMine(): Promise<Subscription[]> {
  const res = await apiFetch<SubscriptionListEnvelope>("/subscription/me");
  return res.data;
}

export async function subscribe(ticketId: string): Promise<void> {
  await apiFetch<void>(`/subscription/${ticketId}`, { method: "POST" });
}

export async function unsubscribe(subscriptionId: string): Promise<void> {
  await apiFetch<void>(`/subscription/${subscriptionId}`, { method: "DELETE" });
}
