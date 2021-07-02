type EventWithNamespace = string;

type EventHandler = (payload: any) => any | Promise<any>;
type EventHandlers = { [key: string]: EventHandler };

type EventListeners = { [key: string]: { handlers: EventHandler[] } };

export { EventWithNamespace, EventHandler, EventHandlers, EventListeners };
