import { useEffect, useState } from "react";
import * as usersApi from "../api/users.api";
import { ApiError } from "../api/client";
import type { AuthUser, Role } from "../types";

export function AdminUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([usersApi.getAll(), usersApi.getRoles()])
      .then(([loadedUsers, loadedRoles]) => {
        setUsers(loadedUsers);
        setRoles(loadedRoles);
      })
      .catch(() => setError("No se pudieron cargar los usuarios"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAssignRole(userId: string, roleId: string) {
    setError(null);
    try {
      const updated = await usersApi.assignRole(userId, roleId);
      setUsers((prev) => prev.map((u) => (u._id === userId ? updated : u)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo asignar el rol");
    }
  }

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="admin-users-page">
      <h1>Usuarios</h1>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select
                  value={roles.find((r) => r.name === u.rol)?._id ?? ""}
                  onChange={(e) => handleAssignRole(u._id, e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
