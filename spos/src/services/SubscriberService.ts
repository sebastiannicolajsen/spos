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

export enum SubscriberServiceEvents {
  CREATE = 'subscriber.create',
  UPDATE = 'subscriber.update',
  DELETE = 'subscriber.delete',
  VALIDATE = 'subscriber.validate',
  ERROR = 'subscriber.error',
}

@Service()
class SubscriberService {
  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject(SubscriberRepositoryId)
    private readonly subscriberRepository: typeof SubscriberRepository,
    @Inject()
    private readonly productService: ProductService,
    @Inject()
    private readonly pricePointService: PricePointService
  ) {}

  async find(id: string) {
    return this.subscriberRepository.findOne({ where: { id } });
  }

  async validate(id: string, objects: string[], code: string) {
    if (this.find(id))
      return { success: false, message: 'Subscriber already existing' };
    for (const oid of objects) {
      if (oid === '*') continue;
      const exists = await this.productService.find(parseInt(oid));
      if (!exists) return { success: false, message: `${oid} does not exist` };
    }
    const module = importFromStringSync(code);
    if (typeof module !== 'function')
      return { success: false, message: 'Code is not a function' };
    if (!code.includes('return'))
      return { success: false, message: 'Code does not return anything' };
    await this.eventBusService.emit(SubscriberServiceEvents.VALIDATE, {
      id,
      objects,
      code,
    });
    return { success: true, message: 'OK' };
  }

  private async subscriberWrapper(subscriber: Subscriber) {
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

      for(const [id, price] of Object.entries(pricePoints)){
        await this.pricePointService.create(parseInt(id), price)
      }
    };

    const genFun = await fun(importFromStringSync(subscriber.code));

    for (const event of subscriber.events) {
      await this.eventBusService.subscribe(
        event,
        genFun
      );
    }
  }

  async init() {
    const subscribers = await this.subscriberRepository.find();
    for (const subscriber of subscribers) {
      await this.subscriberWrapper(subscriber);
    }
  }

  async create(id: string, events: string[], objects: string[], code: string) {
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
    await this.eventBusService.emit(SubscriberServiceEvents.CREATE, subscriber);
    return subscriber;
  }

  async update(
    id: string,
    toUpdate = { events: null, objects: null, code: null }
  ) {
    const subscriber = await this.find(id);
    if (!subscriber) return;
    const { events, objects, code } = toUpdate;
    if (events) subscriber.events = events;
    if (objects) subscriber.objects = objects;
    if (code) subscriber.code = code;

    await this.subscriberRepository.save(subscriber);

    await this.eventBusService.emit(SubscriberServiceEvents.UPDATE, subscriber);
    return subscriber;
  }

  async delete(id: string) {
    const subscriber = await this.find(id);
    if (!subscriber) return;

    const tmp = _.cloneDeep(subscriber);
    await this.subscriberRepository.remove(subscriber);

    await this.eventBusService.emit(SubscriberServiceEvents.DELETE, tmp);
    return subscriber;
  }
}

export default SubscriberService;
