const BASE_URL = import.meta.env.VITE_API_URL;

export interface ApiFieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: ApiFieldError[];

  constructor(message: string, statusCode: number, errors?: ApiFieldError[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
}

interface ErrorEnvelope {
  status: "error";
  statusCode: number;
  error: string;
  errors?: ApiFieldError[];
}

// El backend no tiene un shape de respuesta uniforme para el body de éxito
// (unos usan `data`, auth usa `user`, otros solo `message`), así que apiFetch
// devuelve el body completo tal cual y cada *.api.ts sabe qué campo leer.
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const body = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const errorBody = body as ErrorEnvelope | null;
    throw new ApiError(errorBody?.error ?? res.statusText, res.status, errorBody?.errors);
  }

  return body as T;
}
