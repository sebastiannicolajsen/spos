import { Inject, Service } from 'typedi';
import * as _ from 'lodash';
import {
  PricePointRepository,
  PricePointRepositoryId,
} from '../repositories/PricePointRepository';
import EventBusService from './EventBusService';
import ProductService from './ProductService';
import { PricePoint } from '../models/PricePoint';
import BaseService from './BaseService';
import TransactionService from './TransactionService';

export enum PricePointServiceEvents {
  CREATED = 'pricepoint.created',
  RESET = 'pricepoint.reset',
  FAIL = 'pricepoint.fail',
}

@Service()
class PricePointService extends BaseService {
  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject()
    private readonly productService: ProductService,
    @Inject(PricePointRepositoryId)
    private readonly pricePointRepository: typeof PricePointRepository,
    @Inject()
    private readonly transactionService: TransactionService
  ) {
    super(eventBusService, PricePointServiceEvents.FAIL);
  }

  async create(product_id: number, value: number): Promise<PricePoint> {
    return await this.error(async () => {
      const product = await this.productService.find(product_id, []);
      if (!product) return;
      const pricePoint = new PricePoint();
      pricePoint.value =
        value >= product.minimum_value ? value : product.minimum_value;
      const result = await this.pricePointRepository.create(pricePoint);
      result.product = product;
      await this.pricePointRepository.save(result);

      await this.eventBusService.emit(PricePointServiceEvents.CREATED, result);
      return result;
    });
  }

  async reset(): Promise<boolean> {
    return await this.error(async () => {
      for (const product of await this.productService.get()) {
        for (const pp of product.price_points) {
          await this.pricePointRepository.delete(pp.id);
        }
        await this.create(product.id, product.initial_value);
      }

      await this.transactionService.deleteAll();

      await this.eventBusService.emit(PricePointServiceEvents.RESET, {});

      return true;
    });
  }
}

export default PricePointService;
