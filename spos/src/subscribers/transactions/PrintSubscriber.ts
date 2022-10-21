import { AuthServiceEvents } from '../../services/AuthService';
import Subscriber from '../subscriber';

export default class PrintSubscriber extends Subscriber {
  events(): string[] {
    return ["*"];
  }

  async handler(event: string, data: any): Promise<void> {
    console.log('EVENT TRIGGER ', event, data);
  }
}
