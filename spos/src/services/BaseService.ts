import { Inject } from "typedi";
import EventBusService from "./EventBusService";

export default abstract class BaseService {
  constructor(
    private readonly eventBusService_: EventBusService,
    private readonly fail: string
  ) {}

  async error<T>(fn: Function) : Promise<T> {
      try {
          const res = await fn();
          return res;
      } catch(e){
          await this.eventBusService_.emit(this.fail, e);
          return null;
      }
  }
}
