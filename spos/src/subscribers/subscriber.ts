import { Container } from 'typeorm-typedi-extensions';
import EventBusService from '../services/EventBusService';
import { StaticEvents } from '../services/EventService';

export default abstract class Subscriber {
  eventBusService: EventBusService;

  constructor() {
    console.log('Subscriber constructor');
    this.eventBusService = Container.get(EventBusService);
    const events = this.events()
    if (events[0] === '*') {
      for (const event of StaticEvents as string[]) {
        this.eventBusService.subscribe(event, this.handler);
      }
    } else {
      for (const event of events) {
        this.eventBusService.subscribe(event, this.handler);
      }
    }
  }

  abstract events(): string[];

  abstract handler(event: string, data: any): Promise<void>;
}
