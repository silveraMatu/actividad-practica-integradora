import { apiFetch } from "./client";
import type { AuthUser } from "../types";

interface LoginResponse {
  status: string;
  message: string;
  user: AuthUser & { token: string };
}

export async function register(name: string, email: string, password: string): Promise<void> {
  await apiFetch<void>("/auth/register", { method: "POST", body: { name, email, password } });
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch<LoginResponse>("/auth/login", { method: "POST", body: { email, password } });
  // El token viaja también en el body, pero la cookie httpOnly ya lo maneja;
  // nunca lo persistimos nosotros, solo nos quedamos con los datos del usuario.
  const { token: _token, ...user } = res.user;
  return user;
}

export async function logout(): Promise<void> {
  await apiFetch<void>("/auth/logout", { method: "POST" });
}
