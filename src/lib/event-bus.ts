// src/lib/event-bus.ts
// EVENT BUS ĐỂ ĐỒNG BỘ DỮ LIỆU GIỮA CÁC COMPONENT

type EventCallback = (data?: any) => void;

class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  off(event: string, callback: EventCallback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      this.events.set(
        event,
        callbacks.filter((cb) => cb !== callback),
      );
    }
  }

  emit(event: string, data?: any) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
}

export const eventBus = new EventBus();
