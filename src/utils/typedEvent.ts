export interface Listener<T> {
  (event: T): any;
}

export interface Disposable {
  (): void;
}

export class TypedEvent<T = void> {
  private listeners: Listener<T>[] = [];

  private listenersOncer: Listener<T>[] = [];

  public on = (listener: Listener<T>): Disposable => {
    this.listeners.push(listener);
    return () => this.off(listener);
  };

  public once = (listener: Listener<T>): void => {
    this.listenersOncer.push(listener);
  };

  public off = (listener: Listener<T>) => {
    this.listeners = this.listeners.filter((v) => {
      return v !== listener;
    });
  };

  public emit = (event: T) => {
    this.listeners.forEach((listener) => listener(event));

    this.listenersOncer.forEach((listener) => listener(event));

    this.listenersOncer = [];
  };
}
