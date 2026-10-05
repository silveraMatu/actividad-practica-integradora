import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth.api";
import * as subscriptionsApi from "../api/subscriptions.api";
import type { AuthUser } from "../types";

const STORAGE_KEY = "mesaDeAyuda.user";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: AuthUser | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage puede no estar disponible (modo privado, etc.); no es crítico.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readCachedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // La sesión real vive en la cookie httpOnly `token`, que el frontend no puede leer.
    // El cache en localStorage es solo para no mostrar un flash de "no logueado" al
    // refrescar: acá confirmamos contra el backend con un endpoint liviano disponible
    // para cualquier rol. Si la cookie ya no es válida, esto devuelve 401 y limpiamos.
    const cached = readCachedUser();
    if (!cached) {
      setLoading(false);
      return;
    }
    subscriptionsApi
      .getMine()
      .then(() => setLoading(false))
      .catch(() => {
        setUser(null);
        writeCachedUser(null);
        setLoading(false);
      });
  }, []);

  async function login(email: string, password: string) {
    const loggedUser = await authApi.login(email, password);
    setUser(loggedUser);
    writeCachedUser(loggedUser);
  }

  async function register(name: string, email: string, password: string) {
    await authApi.register(name, email, password);
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      writeCachedUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
