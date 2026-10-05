import { useEffect, useState } from "react";
import * as notificationsApi from "../api/notifications.api";
import type { Notification } from "../types";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  function reload() {
    return notificationsApi.getAll().then(setNotifications);
  }

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, []);

  async function handleMarkRead(id: string) {
    await notificationsApi.markRead(id);
    await reload();
  }

  async function handleMarkAllRead() {
    await notificationsApi.markAllRead();
    await reload();
  }

  if (loading) return <p>Cargando notificaciones...</p>;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Notificaciones</h1>
        <button onClick={handleMarkAllRead}>Marcar todas como leídas</button>
      </div>
      {notifications.length === 0 ? (
        <p>No tenés notificaciones.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              {n.message}
              <button onClick={() => handleMarkRead(n.id)}>Marcar como leída</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
