import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import * as ticketsApi from "../api/tickets.api";
import { ApiError } from "../api/client";

export function TicketFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const ticket = await ticketsApi.create(title, description);
      navigate(`/tickets/${ticket._id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo crear el ticket");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ticket-form-page">
      <h1>Nuevo ticket</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Título
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Descripción
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Creando..." : "Crear ticket"}
        </button>
      </form>
    </div>
  );
}
