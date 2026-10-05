import { apiFetch } from "./client";
import type { AuthUser, Role } from "../types";

interface UserListEnvelope {
  data: AuthUser[];
}

interface RoleListEnvelope {
  data: Role[];
}

export async function getAll(): Promise<AuthUser[]> {
  const res = await apiFetch<UserListEnvelope>("/user/");
  return res.data;
}

export async function getRoles(): Promise<Role[]> {
  const res = await apiFetch<RoleListEnvelope>("/roles");
  return res.data;
}

export async function assignRole(userId: string, roleId: string): Promise<AuthUser> {
  const res = await apiFetch<{ data: AuthUser }>(`/user/${userId}`, { method: "PATCH", body: { roleId } });
  return res.data;
}
