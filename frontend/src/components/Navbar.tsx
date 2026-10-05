import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Can } from "./Can";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Tickets
      </Link>
      <span className="navbar-user">
        {user.name} ({user.rol})
      </span>
      <NotificationBell />
      <Can role="admin">
        <Link to="/admin/users">Usuarios</Link>
      </Can>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </nav>
  );
}
