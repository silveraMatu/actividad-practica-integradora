# Patrones de diseño y principios SOLID

## Patrones de diseño

### Singleton

**Archivo:** `backend/src/common/database/index.ts`

**Problema que resuelve:** la aplicación necesita una única conexión a MongoDB compartida por todos los módulos (repositorios, scripts de seed, etc.). Sin este patrón, cada módulo que necesitara la base de datos podría terminar abriendo su propia conexión. `Database` tiene constructor privado y un método estático `getInstance()`, así que `mongoose.connect()` se llama una sola vez en toda la vida de la aplicación.

```ts
export class Database {
  private static instance: Database;
  private connection: Mongoose | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(uri: string, options: ConnectOptions = {}): Promise<Mongoose> {
    if (this.connection && mongoose.connection.readyState === 1) {
      return this.connection;
    }
    // ...
  }
}

export const db = Database.getInstance();
```

`main.ts` y `common/scripts/seed.ts` importan ese mismo `db` exportado — nunca instancian `Database` con `new`.

---

### Observer

**Archivos:**
- `backend/src/common/observer/Isubject.ts` — interfaz `ISubject`
- `backend/src/common/observer/IObserver.ts` — interfaz `IObserver`
- `backend/src/common/observer/EventPublisher.ts` — el Subject
- `backend/src/modules/notifications/services/notification.service.ts` — el Observer concreto
- `backend/src/modules/ticket/service/ticket.service.ts` — quién dispara el evento
- `backend/src/main.ts` — dónde se registra el observer

**Problema que resuelve:** cuando un ticket cambia de estado, `TicketService` no tiene por qué saber quién está suscripto ni cómo se les notifica — eso rompería la responsabilidad única del service y acoplaría tickets a notificaciones. Con Observer, `TicketService` solo anuncia el evento a través de un `ISubject`; cualquier cantidad de observers puede reaccionar sin que `TicketService` se entere ni se modifique. La implementación es propia, sin usar `EventEmitter` de Node.

```ts
// Isubject.ts / IObserver.ts
export interface ISubject {
  attach(o: IObserver): void
  detach(o: IObserver): void
  notify(event: TicketStatusChangedEvent): Promise<void>
}

export interface IObserver {
  update(event: TicketStatusChangedEvent): Promise<void> | void
}
```

```ts
// EventPublisher.ts — el Subject
export class EventPublisher implements ISubject {
  observers: IObserver[] = []

  attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer)
    if (!isExist) this.observers.push(observer)
  }

  async notify(event: TicketStatusChangedEvent): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(event)
    }
  }
}
```

```ts
// ticket.service.ts — quién dispara la notificación
async changeStatus(id: string, newStatus: TicketStatus): Promise<Iticket> {
  // ...
  const event: TicketStatusChangedEvent = {
    ticketId: id,
    ticketTitle: ticket!.title,
    previousStatus: previusStatus,
    newStatus,
    updatedAt: new Date(),
  };

  await this.eventPublisher.notify(event);
  return updateTicket;
}
```

```ts
// notification.service.ts — el Observer concreto
export class NotificationService implements INotificationService {
  async update(event: TicketStatusChangedEvent): Promise<void> {
    const subscriptions = await this.subscriptionRepo.findAllSubscriptionsByTicket(event.ticketId)
    if (!subscriptions.length) return
    // ... notifica a cada suscriptor
  }
}
```

```ts
// main.ts — el registro, en el composition root
const eventPublisher = new EventPublisher();
const notificationService = new NotificationService(subscriptionRepo, notificationRepo);
eventPublisher.attach(notificationService);
```

---

### Factory

**Archivo:** `backend/src/modules/notifications/factory/notification.factory.ts`

**Problema que resuelve:** `NotificationService` necesita enviar la notificación por dos canales distintos (in-app y consola), pero no debe decidir con `new` qué clase concreta instanciar — eso acoplaría el service a cada implementación de canal. `NotifierFactory.createNotifier(type)` centraliza esa decisión en un solo lugar: agregar un canal nuevo significa agregar un `case` en la factory, no tocar el service que los consume.

```ts
type NotifierType = "inapp" | "console"

export class NotifierFactory {
  private constructor() {}
  static createNotifier(type: NotifierType): INotifier {
    switch (type) {
      case "inapp":
        return new InAppNotifier(new NotificationRepository());
      case "console":
        return new ConsoleNotifierAdapter();
      default:
        throw new AppError(`Tipo de notificador desconocido: ${type}`, 500);
    }
  }
}
```

```ts
// notification.service.ts — consumo, sin "new" sobre ningun canal
const inAppNotifier = NotifierFactory.createNotifier("inapp")
const consoleNotifier = NotifierFactory.createNotifier("console")
```

---

### Adapter

**Archivo:** `backend/src/modules/notifications/factory/notification.factory.ts` (clase `ConsoleNotifierAdapter`)

**Problema que resuelve:** todo canal de notificación debe cumplir el contrato `INotifier.send(notification): Promise<void>`. `ConsoleNotifier.logNotification()` es una API que solo sabe imprimir texto con `console.log` y no devuelve nada — una forma incompatible con `INotifier`. `ConsoleNotifierAdapter` es el intermediario entre ambas formas: implementa `INotifier` y, por dentro, traduce la llamada al formato que espera `ConsoleNotifier`.

```ts
interface INotifier {
  send(notification: Notification): Promise<void>;
}

class ConsoleNotifier {
  logNotification(type: string, to: string, ticketId: string, message: string) {
    console.log(`[${type.toUpperCase()}]\n to: ${to}\n ticketId: ${ticketId}\n message: ${message}`);
  }
}

class ConsoleNotifierAdapter implements INotifier {
  private readonly consoleNotifier: ConsoleNotifier

  constructor(consoleNotifier?: ConsoleNotifier) {
    this.consoleNotifier = consoleNotifier ?? new ConsoleNotifier();
  }

  async send(notification: Notification): Promise<void> {
    const { to, ticketId, message } = notification;
    this.consoleNotifier.logNotification("notification", to, ticketId, message);
  }
}
```

`NotificationService` nunca llama a `console.log` directamente: solo conoce `INotifier`.

---

## Principios SOLID

### S — Responsabilidad única

**Archivos:** `backend/src/modules/ticket/ticket.controller.ts`, `backend/src/modules/ticket/service/ticket.service.ts`, `backend/src/modules/ticket/repository/ticket.repository.ts`

Cada capa tiene una única razón para cambiar: el controller solo traduce HTTP↔negocio (lee `req`, llama al service, devuelve `res`), el service solo tiene reglas de negocio, el repository solo sabe hablar con Mongo.

```ts
// ticket.controller.ts — solo traduce HTTP, no tiene reglas de negocio
changeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTicket = await this.ticketService.changeStatus(id!.toString(), status);
    res.status(200).json({ status: "OK", statusCode: 200, data: updatedTicket });
  } catch (err) {
    next(err);
  }
}
```

### O — Abierto/cerrado

**Archivo:** `backend/src/modules/notifications/factory/notification.factory.ts`

Agregar un canal de notificación nuevo (por ejemplo, "email") significa agregar un `case` más en el `switch` de `NotifierFactory` — `NotificationService` queda cerrado a modificación, abierto a extensión.

```ts
static createNotifier(type: NotifierType): INotifier {
  switch (type) {
    case "inapp": return new InAppNotifier(new NotificationRepository());
    case "console": return new ConsoleNotifierAdapter();
    // case "email": return new EmailNotifierAdapter();  <- se agregaria asi
  }
}
```

### L — Sustitución de Liskov

**Archivo:** `backend/src/modules/notifications/factory/notification.factory.ts` (`INotifier`, `InAppNotifier`, `ConsoleNotifierAdapter`)

Donde el código espera un `INotifier`, cualquiera de las dos implementaciones puede usarse sin romper nada — ambas cumplen exactamente el mismo contrato (`send(notification): Promise<void>`), sin precondiciones ni efectos adicionales que una cumpla y la otra no.

```ts
interface INotifier {
  send(notification: Notification): Promise<void>;
}
class InAppNotifier implements INotifier { async send(n: Notification): Promise<void> { /* ... */ } }
class ConsoleNotifierAdapter implements INotifier { async send(n: Notification): Promise<void> { /* ... */ } }
```

### I — Segregación de interfaces

**Archivo:** `backend/src/modules/notifications/repository/notification.repository.types.ts`

`INotificationRepository` expone únicamente los métodos que el módulo de notificaciones necesita (`create`, `findAllByUser`, `findNotReadByUser`, `markAsRead`, `markAllAsRead`) — no una interfaz de repositorio genérica compartida por todos los módulos, que obligaría a implementar métodos irrelevantes.

```ts
export interface INotificationRepository {
  create(notification: CreateNotificationDTO): Promise<INotification>;
  findAllByUser(userId: string): Promise<INotification[]>;
  findNotReadByUser(userId: string): Promise<INotification[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
```

### D — Inversión de dependencias

**Archivos:** `backend/src/modules/ticket/service/ticket.service.ts`, `backend/src/main.ts`

`TicketService` depende de interfaces (`ITicketRepository`, `IUserRepository`, `ISubscriptionRepository`, `ISubject`), nunca de clases concretas. Las implementaciones concretas (`TicketRepository`, `EventPublisher`, etc.) solo se conocen en `main.ts`, el composition root, que es el único lugar de todo el backend donde se hace `new` sobre ellas.

```ts
// ticket.service.ts — depende de interfaces, no de implementaciones
export class TicketService implements IticketService {
  constructor(
    private readonly ticketRepo: ITicketRepository,
    private readonly userRepo: IUserRepository,
    private readonly subscriptionRepo: ISubscriptionRepository,
    private readonly eventPublisher: ISubject,
  ) { }
}
```

```ts
// main.ts — las implementaciones concretas se inyectan aca, y solo aca
const ticketService = new TicketService(ticketRepo, userRepo, subscriptionRepo, eventPublisher);
```