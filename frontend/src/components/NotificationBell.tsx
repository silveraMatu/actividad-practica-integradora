import { useEffect, useState } from "react";
import { Link } from "react-router";
import * as notificationsApi from "../api/notifications.api";
import { useAuth } from "../context/AuthContext";

const POLL_INTERVAL_MS = 10_000;

export function NotificationBell() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const unread = await notificationsApi.getUnread();
        if (!cancelled) setUnreadCount(unread.length);
      } catch {
        // Error transitorio (p.ej. la sesión venció justo ahora); el próximo
        // tick se recupera solo, o ProtectedRoute redirige a /login.
      }
    }

    poll();
    const intervalId = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [user]);

  return (
    <Link to="/notifications" className="notification-bell">
      Notificaciones{unreadCount > 0 && <span className="badge">{unreadCount}</span>}
    </Link>
  );
}
