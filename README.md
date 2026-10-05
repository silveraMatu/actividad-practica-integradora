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

> El frontend todavía no está desarrollado. Esta sección se va a actualizar cuando esté listo, incluyendo el flujo completo con `docker compose up --build` levantando backend + frontend + base de datos. Por ahora, Docker Compose solo levanta la base de datos; el backend se corre localmente.

## Cómo ejecutar el proyecto (estado actual)

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

## Ejecución sin Docker (opcional)
Si ya tenés una instancia de MongoDB corriendo localmente, podés saltar el paso 3 y ajustar `MONGO_URI` en el `.env` de la raíz para que apunte a esa instancia. Los pasos 4 y 5 son los mismos.

## Variables de entorno

El archivo `.env` vive en la **raíz del repositorio** (no dentro de `backend/`) — tanto `docker-compose.yml` como el backend lo leen desde ahí.

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGO_URI` | Cadena de conexión a MongoDB | `mongodb://admin:admin@localhost:27017` |
| `MONGO_DB_NAME` | Nombre de la base de datos | `mesa_de_ayuda` |
| `MONGO_USER` | Usuario root de Mongo (usado por Docker Compose) | `admin` |
| `MONGO_PASSWORD` | Contraseña del usuario root de Mongo | `admin` |
| `SECRET` | Clave para firmar los JWT | `cambiar-este-secreto-en-produccion` |
| `SALT` | Rondas de hashing de bcrypt | `10` |
| `PORT` | Puerto del backend | `3000` |

## Usuarios de prueba

Creados automáticamente por `npm run seed`:

| Rol | Email | Contraseña |
|---|---|---|
| admin | admin@example.com | admin123 |
| operator | operator@example.com | operator123 |
| user | user@example.com | user123 |

## Cómo probar el flujo de notificaciones
1. Ingresar como `user` (`POST /api/auth/login`) y suscribirse a un ticket existente (`POST /api/subscription/:ticketId`).
2. Ingresar como `operator` y cambiar el estado de ese ticket (`PUT /api/ticket/change-status/:id`).
3. Como `user`, consultar `GET /api/notifications`: la notificación del cambio de estado aparece ahí.
4. Verificar la misma notificación en la terminal donde corre `npm run dev` — el `ConsoleNotifierAdapter` imprime una línea `[NOTIFICATION] ...` en el momento del cambio de estado.

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

## Patrones y principios SOLID
Ver [PATTERNS.md](./PATTERNS.md).
