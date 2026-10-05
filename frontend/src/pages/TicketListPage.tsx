import { useEffect, useState } from "react";
import { Link } from "react-router";
import * as ticketsApi from "../api/tickets.api";
import { Can } from "../components/Can";
import type { Ticket } from "../types";

export function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ticketsApi
      .getAll()
      .then(setTickets)
      .catch(() => setError("No se pudieron cargar los tickets"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando tickets...</p>;

  return (
    <div className="ticket-list-page">
      <div className="page-header">
        <h1>Tickets</h1>
        <Can role={["admin", "operator"]}>
          <Link to="/tickets/new">Nuevo ticket</Link>
        </Can>
      </div>
      {error && <p className="error">{error}</p>}
      {tickets.length === 0 ? (
        <p>No hay tickets todavía.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket._id}>
              <Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link> — {ticket.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
