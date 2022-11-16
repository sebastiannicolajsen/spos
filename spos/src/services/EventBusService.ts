import { Service } from 'typedi';
import RealRedis, { Redis } from 'ioredis';
import * as FakeRedis from 'ioredis-mock';
import * as _ from 'lodash';

let client: Redis = null;
let subscriber: Redis = null;

if (process.env.NODE_ENV === 'test') {
  client = new FakeRedis();
  subscriber = new FakeRedis();
} else {
  client = new RealRedis(process.env.REDIS_HOST);
  subscriber = new RealRedis(process.env.REDIS_HOST);
}

@Service()
class EventBusService {
  private readonly channel = 'spos-events';
  private static nextId = 0;
  private static map = {};

  constructor() {
    subscriber.subscribe(this.channel, (err, count) => {
      if (err) {
        console.error(err);
      }
      console.log(`Redis: subscribing to spos-events`);
    });
  }

  public async emit(event: string, data: any): Promise<void> {
    console.log(`Redis: emitting ${event}`);
    client.publish(this.channel, JSON.stringify({ event, data }));
  }

  public async unsubscribe(id: number): Promise<void> {
    subscriber.removeListener('message', EventBusService.map[id]);
  }

  public async subscribe(
    event: string,
    callback: (event: string, data: any) => void
  ): Promise<number> {
    const all = event === '*';
    const cb = (_, message) => {
      const msg = JSON.parse(message);
      const event_ = msg.event;
      const data = msg.data;
      if (all || event_ === event) callback(event_, data);
    };
    subscriber.on('message', cb);
    const id = EventBusService.nextId++;
    EventBusService.map[id] = cb;
    return id;
  }
}

export default EventBusService;
