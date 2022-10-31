import { Inject, Service } from 'typedi';
import {
  SubscriberRepository,
  SubscriberRepositoryId,
} from '../repositories/SubscriberRepository';
import * as _ from 'lodash';
import EventBusService from './EventBusService';
import ProductService from './ProductService';
import { importFromStringSync } from 'module-from-string';
import { Subscriber } from '../models/Subscriber';
import { Product } from '../models/Product';
import PricePointService from './PricePointService';
import BaseService from './BaseService';
import { PricePoint } from '../models/PricePoint';
import { Transaction } from '../models/Transaction';

export enum SubscriberServiceEvents {
  CREATE = 'subscriber.create',
  UPDATE = 'subscriber.update',
  DELETE = 'subscriber.delete',
  TRIGGER = 'subscriber.trigger',
  LAST_EXEC_UPDATE = 'subscriber.last_exec_update',
  VALIDATE = 'subscriber.validate',
  ERROR = 'subscriber.error',
  FAIL = 'subscriber.fail',
}

export type ValidationEvent = {
  success: boolean;
  message: string;
};

@Service()
class SubscriberService extends BaseService {
  private static last_execution = new Date();
  private static wrappers = {};

  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject(SubscriberRepositoryId)
    private readonly subscriberRepository: typeof SubscriberRepository,
    @Inject()
    private readonly productService: ProductService,
    @Inject()
    private readonly pricePointService: PricePointService
  ) {
    super(eventBusService, SubscriberServiceEvents.FAIL);
  }

  async init(): Promise<boolean> {
    return await this.error(async () => {
      const subscribers = await this.subscriberRepository.find();
      for (const subscriber of subscribers) {
        await this.subscriberWrapper(subscriber);
      }
      return true;
    });
  }

  async find(id: string): Promise<Subscriber> {
    return await this.error(async () => {
      return this.subscriberRepository.findOne({ where: { id } });
    });
  }

  async get(): Promise<Subscriber[]> {
    return await this.error(async () => {
      return this.subscriberRepository.find();
    });
  }

  getLastExecution(): Date {
    return SubscriberService.last_execution;
  }

  async validate(
    id: string,
    objects: string[],
    code: string
  ): Promise<ValidationEvent> {
    return await this.error(async () => {
      if (this.find(id))
        return { success: false, message: 'Subscriber already existing' };
      for (const oid of objects) {
        if (oid === '*') continue;
        const exists = await this.productService.find(parseInt(oid));
        if (!exists)
          return { success: false, message: `${oid} does not exist` };
      }
      const module = importFromStringSync(code);
      if (typeof module !== 'function')
        return { success: false, message: 'Code is not a function' };

      try {
        const product = new Product();
        product.id = 1;
        product.name = 'test';
        product.price_points = [new PricePoint()];
        product.price_points[0].value = 1;
        product.price_points[0].timestamp = new Date();
        product.transactions = [new Transaction()];
        const result = module([product]);
        const obj = result[1];
        if (obj instanceof PricePoint)
          return {
            success: false,
            message: 'Code does not return PricePoints',
          };
      } catch (e) {
        return {
          success: false,
          message: 'Code failed to accept or return a valid object',
        };
      }

      await this.eventBusService.emit(SubscriberServiceEvents.VALIDATE, {
        id,
        objects,
        code,
      });
      return { success: true, message: 'OK' };
    });
  }

  private async subscriberWrapper(subscriber: Subscriber) {
    return await this.error(async () => {
      const fun = (module) => async (event, data) => {
        let products: Product | Product[] = null;
        if (subscriber.objects.includes('*')) {
          products = await this.productService.get();
        } else {
          products = [];
          for (const object of subscriber.objects) {
            products.push(await this.productService.find(parseInt(object)));
          }
        }

        let pricePoints: { [id: number]: number } = null;
        try {
          pricePoints = module(products);
        } catch (e) {
          this.eventBusService.emit(SubscriberServiceEvents.ERROR, {
            subscriber,
            error: e,
          });
          return;
        }

        for (const [id, price] of Object.entries(pricePoints)) {
          await this.pricePointService.create(parseInt(id), price);
        }
        await this.eventBusService.emit(SubscriberServiceEvents.TRIGGER, {
          subscriber,
        });
        await this.updateLastExecution();
      };

      const genFun = await fun(importFromStringSync(subscriber.code));

      SubscriberService.wrappers[subscriber.id] = genFun;

      for (const event of subscriber.events) {
        await this.eventBusService.subscribe(event, genFun);
      }
    });
  }

  async updateLastExecution(): Promise<void> {
    SubscriberService.last_execution = new Date();
    await this.eventBusService.emit(SubscriberServiceEvents.LAST_EXEC_UPDATE, {
      time: SubscriberService.last_execution,
    });
  }

  async trigger(id: string) {
    return await this.error(async () => {
      if(!SubscriberService.wrappers[id]) return false;
      await SubscriberService.wrappers[id]();
      return true;
    });
  }

  async create(
    id: string,
    events: string[],
    objects: string[],
    code: string
  ): Promise<Subscriber> {
    return await this.error(async () => {
      const validation = await this.validate(id, objects, code);
      if (!validation.success) return validation;
      const subscriber = new Subscriber();
      subscriber.id = id;
      subscriber.events = events;
      subscriber.objects = objects;
      subscriber.code = code;
      await this.subscriberRepository.create(subscriber);
      await this.subscriberRepository.save(subscriber);
      await this.subscriberWrapper(subscriber);
      await this.eventBusService.emit(
        SubscriberServiceEvents.CREATE,
        subscriber
      );
      return subscriber;
    });
  }

  async update(
    id: string,
    toUpdate = { events: null, objects: null, code: null }
  ): Promise<Subscriber> {
    return await this.error(async () => {
      const subscriber = await this.find(id);
      if (!subscriber) return;
      const { events, objects, code } = toUpdate;
      if (events) subscriber.events = events;
      if (objects) subscriber.objects = objects;
      if (code) subscriber.code = code;

      await this.subscriberRepository.save(subscriber);

      await this.eventBusService.emit(
        SubscriberServiceEvents.UPDATE,
        subscriber
      );
      return subscriber;
    });
  }

  async delete(id: string): Promise<boolean> {
    return await this.error(async () => {
      const subscriber = await this.find(id);
      if (!subscriber) return;

      const tmp = _.cloneDeep(subscriber);
      await this.subscriberRepository.remove(subscriber);

      await this.eventBusService.emit(SubscriberServiceEvents.DELETE, tmp);
      return true;
    });
  }
}

export default SubscriberService;
