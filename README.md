# Mesa de Ayuda — TP Integrador TLP4

**Dominio:** A — Mesa de ayuda (Ticket)
**Base de datos:** MongoDB + Mongoose
**Organización del backend:** Carpeta por módulo

## Integrantes
- Silvera, Matías — silveraMatu
- Ayala, Lautaro — Lauttd

## Descripción
Sistema de mesa de ayuda donde los usuarios crean tickets que pasan por distintos estados (`ABIERTO`, `EN_PROGRESO`, `RESUELTO`, `CERRADO`). Cualquier usuario puede suscribirse a un ticket y recibe una notificación (in-app y por consola del backend) cada vez que su estado cambia, implementado con los patrones Singleton, Observer, Factory y Adapter.

## Requisitos previos
- Docker y Docker Compose
- Git
- (Opcional, para desarrollo local sin Docker) Node.js 22+

## Estado actual del proyecto

> Backend y frontend están desarrollados y funcionales. Por ahora, Docker Compose solo levanta la base de datos; backend y frontend se corren localmente con `npm run dev` cada uno (dockerizar ambos queda como mejora "valorada" a futuro).

## Cómo ejecutar el proyecto

1. Clonar el repositorio:
   ```bash
   git clone [url]
   cd [carpeta]
   ```
2. Crear el archivo de variables de entorno (en la raíz del repositorio, no dentro de `backend/`):
   ```bash
   cp .env.example .env
   ```
3. Levantar la base de datos:
   ```bash
   docker compose up -d
   ```
4. Instalar dependencias, sembrar roles/usuarios de prueba y levantar el backend:
   ```bash
   cd backend
   npm install
   npm run seed
   npm run dev
   ```
5. La API queda disponible en `http://localhost:3000/api`.
6. En otra terminal, levantar el frontend (proyecto independiente, con su propio `package.json`):
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
7. La aplicación queda disponible en `http://localhost:5173`.

## Ejecución sin Docker (opcional)
Si ya tenés una instancia de MongoDB corriendo localmente, podés saltar el paso 3 y ajustar `MONGO_URI` en el `.env` de la raíz para que apunte a esa instancia. Los pasos 4 y 5 son los mismos.

## Variables de entorno

El archivo `.env` de la **raíz del repositorio** (no dentro de `backend/`) es leído tanto por `docker-compose.yml` como por el backend.

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGO_URI` | Cadena de conexión a MongoDB | `mongodb://admin:admin@localhost:27017` |
| `MONGO_DB_NAME` | Nombre de la base de datos | `mesa_de_ayuda` |
| `MONGO_USER` | Usuario root de Mongo (usado por Docker Compose) | `admin` |
| `MONGO_PASSWORD` | Contraseña del usuario root de Mongo | `admin` |
| `SECRET` | Clave para firmar los JWT | `cambiar-este-secreto-en-produccion` |
| `SALT` | Rondas de hashing de bcrypt | `10` |
| `PORT` | Puerto del backend | `3000` |

El frontend es un proyecto separado y tiene su **propio** `.env` en `frontend/.env` (ver `frontend/.env.example`):

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API consumida por el frontend | `http://localhost:3000/api` |

## Usuarios de prueba

Creados automáticamente por `npm run seed`:

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@example.com | admin123 |
| operator | operator@example.com | operator123 |
| user | user@example.com | user123 |

## Cómo probar el flujo de notificaciones

**Desde el frontend** (`http://localhost:5173`):
1. Iniciar sesión como `user` en una ventana, entrar al detalle de un ticket que no sea propio y hacer clic en "Suscribirme".
2. En otra ventana (o una de incógnito), iniciar sesión como `operator` y cambiar el estado de ese mismo ticket desde su detalle.
3. Volver a la sesión de `user` y abrir "Notificaciones" (o esperar a que suba el contador de la campanita, que hace polling cada 10s): ahí aparece la notificación del cambio de estado.
4. Verificar la misma notificación en la terminal donde corre `npm run dev` del backend — el `ConsoleNotifierAdapter` imprime una línea `[NOTIFICATION] ...` en el momento del cambio de estado.

**Vía API directamente** (equivalente, sin frontend):
1. Ingresar como `user` (`POST /api/auth/login`) y suscribirse a un ticket existente (`POST /api/subscription/:ticketId`).
2. Ingresar como `operator` y cambiar el estado de ese ticket (`PUT /api/ticket/change-status/:id`).
3. Como `user`, consultar `GET /api/notifications`: la notificación del cambio de estado aparece ahí.
4. Verificar la misma notificación en la terminal donde corre `npm run dev` del backend.

## Endpoints principales

| Método | Ruta | Rol requerido |
|---|---|---|
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/logout` | — |
| GET | `/api/user` | admin |
| PATCH | `/api/user/:id` | admin |
| GET | `/api/ticket` | admin, operator, user |
| POST | `/api/ticket` | admin, operator |
| GET | `/api/ticket/:id` | admin, operator, user |
| PUT | `/api/ticket/change-status/:id` | admin, operator |
| DELETE | `/api/ticket/:id` | admin |
| GET | `/api/subscription/me` | admin, operator, user |
| POST | `/api/subscription/:ticketId` | admin, operator, user |
| DELETE | `/api/subscription/:id` | admin, operator, user |
| GET | `/api/notifications` | admin, operator, user |
| GET | `/api/notifications/unread` | admin, operator, user |
| PATCH | `/api/notifications/:id/read` | admin, operator, user |
| PATCH | `/api/notifications/read-all` | admin, operator, user |
| GET | `/api/roles` | admin |

## Frontend

React + TypeScript + Vite, en `frontend/` como proyecto totalmente independiente del backend (propio `package.json`, `tsconfig.json`, `Dockerfile`). Sin frameworks de CSS ni Axios: estilos en un único CSS plano y HTTP con `fetch` nativo (`credentials: "include"`, ya que la sesión viaja en la cookie httpOnly que setea el backend, no en `localStorage`).

Pantallas: login/registro, listado y detalle de tickets (con suscripción/desuscripción y, según el rol, cambio de estado o borrado), formulario de creación de ticket, bandeja de notificaciones con campanita de no leídas (polling cada 10s) y panel de administración de usuarios/roles. El ocultamiento de botones por rol (`Can`, `ProtectedRoute`) es solo un complemento de UX — la validación real de permisos la hace el backend en cada request.

## Patrones y principios SOLID
Ver [PATTERNS.md](./PATTERNS.md).
