import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Rol } from "../types";

interface ProtectedRouteProps {
  roles?: Rol[];
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;
  // Chequeo de rol a nivel de ruta: es cosmético, igual que `Can`. La protección
  // real la hace el backend (role.middleware.ts) en cada request.
  if (roles && !roles.includes(user.rol)) return <Navigate to="/" replace />;

  return <Outlet />;
}
