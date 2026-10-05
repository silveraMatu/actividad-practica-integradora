import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import type { Rol } from "../types";

interface CanProps {
  role: Rol | Rol[];
  children: ReactNode;
}

// Muestra los hijos solo si el usuario logueado tiene el rol permitido.
// Es un complemento de UX: la validación real de permisos ocurre en el
// backend (role.middleware.ts), que rechaza la operación igual aunque
// alguien fuerce el botón a mano desde las devtools.
export function Can({ role, children }: CanProps) {
  const { user } = useAuth();
  if (!user) return null;

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (!allowedRoles.includes(user.rol)) return null;

  return <>{children}</>;
}
