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

  private readonly channel = "spos-events"

  constructor() {
    subscriber.subscribe(this.channel, (err, count) => {
      if (err) {
        console.error(err);
      }
      console.log(`Redis: subscribing to spos-events`);
    });
  }

  public async emit(event: string, data: any): Promise<void> {
    client.publish(this.channel, JSON.stringify([event, data]));
  }

  public async subscribe(
    event: string,
    callback: (event: string, data: any) => void
  ): Promise<void> {
    subscriber.on('message', (_, message) => {
      const [event_, data] = JSON.parse(message);
      if (event_ === event) callback(event_, data);
    });
  }
}

export default EventBusService;
