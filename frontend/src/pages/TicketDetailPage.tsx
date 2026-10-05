import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import * as ticketsApi from "../api/tickets.api";
import * as subscriptionsApi from "../api/subscriptions.api";
import { ApiError } from "../api/client";
import { Can } from "../components/Can";
import { useAuth } from "../context/AuthContext";
import type { Ticket, TicketStatus } from "../types";

const STATUS_OPTIONS: TicketStatus[] = ["ABIERTO", "EN_PROGRESO", "RESUELTO", "CERRADO"];

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([ticketsApi.getById(id), subscriptionsApi.getMine()])
      .then(([loadedTicket, subscriptions]) => {
        setTicket(loadedTicket);
        const mine = subscriptions.find((s) => s.ticketId._id === id);
        setSubscriptionId(mine ? mine._id : null);
      })
      .catch(() => setError("No se pudo cargar el ticket"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubscribe() {
    if (!id) return;
    setActionError(null);
    try {
      await subscriptionsApi.subscribe(id);
      const subscriptions = await subscriptionsApi.getMine();
      const mine = subscriptions.find((s) => s.ticketId._id === id);
      setSubscriptionId(mine ? mine._id : null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "No se pudo suscribir");
    }
  }

  async function handleUnsubscribe() {
    if (!subscriptionId) return;
    setActionError(null);
    try {
      await subscriptionsApi.unsubscribe(subscriptionId);
      setSubscriptionId(null);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "No se pudo desuscribir");
    }
  }

  async function handleChangeStatus(status: TicketStatus) {
    if (!id) return;
    setActionError(null);
    try {
      const updated = await ticketsApi.changeStatus(id, status);
      setTicket(updated);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "No se pudo cambiar el estado");
    }
  }

  async function handleDelete() {
    if (!id) return;
    setActionError(null);
    try {
      await ticketsApi.remove(id);
      navigate("/");
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "No se pudo eliminar el ticket");
    }
  }

  if (loading) return <p>Cargando...</p>;
  if (error || !ticket) return <p className="error">{error ?? "Ticket no encontrado"}</p>;

  const isOwner = user?._id === ticket.ownerId;

  return (
    <div className="ticket-detail-page">
      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>
      <p>
        Estado: <strong>{ticket.status}</strong>
      </p>

      {actionError && <p className="error">{actionError}</p>}

      {!isOwner &&
        (subscriptionId ? (
          <button onClick={handleUnsubscribe}>Desuscribirme</button>
        ) : (
          <button onClick={handleSubscribe}>Suscribirme</button>
        ))}

      <Can role={["admin", "operator"]}>
        <div className="status-control">
          <label>
            Cambiar estado
            <select value={ticket.status} onChange={(e) => handleChangeStatus(e.target.value as TicketStatus)}>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Can>

      <Can role="admin">
        <button onClick={handleDelete}>Eliminar ticket</button>
      </Can>
    </div>
  );
}
