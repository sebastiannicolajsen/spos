import { Inject, Service } from 'typedi';
import {
  CronJobRepository,
  CronJobRepositoryId,
} from '../repositories/CronJobRepository';
import {
  SubscriberRepository,
  SubscriberRepositoryId,
} from '../repositories/SubscriberRepository';
import * as _ from 'lodash';
import { AuthServiceEvents } from './AuthService';
import { SellerServiceEvents } from './SellerService';
import {
  SubscriberServiceEvents,
} from './SubscriberService';
import { CronServiceEvents } from './CronService';
import PricePointServiceEvents from './PricePointService';
import { ProductServiceEvents } from './ProductService';
import { TransactionServiceEvents } from './TransactionService';
import BaseService from './BaseService';

export const StaticEvents = [
  ..._.values(AuthServiceEvents),
  ..._.values(SellerServiceEvents),
  ..._.values(CronServiceEvents),
  ..._.values(PricePointServiceEvents),
  ..._.values(SubscriberServiceEvents),
  ..._.values(ProductServiceEvents),
  ..._.values(TransactionServiceEvents),
  ""
];



@Service()
class EventService{
  constructor(
    @Inject(CronJobRepositoryId)
    private readonly cronJobRepository: typeof CronJobRepository,
    @Inject(SubscriberRepositoryId)
    private readonly subscriberRepository: typeof SubscriberRepository
  ) {
  }

  async get() {
    const cronTriggers = await this.cronJobRepository.find();
    const subscribers = await this.subscriberRepository.find();
    const total = [
      ...StaticEvents,
      ...cronTriggers.map((c) => c.event),
      ..._.reduce(
        subscribers.map((s) => s.events),
        (acc, val) => [...acc, ...val],
        []
      ),
    ];
    return total;
  }
}

export default EventService;
