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
    private readonly pricePointRepository: typeof PricePointRepository
  ) {
    super(eventBusService, PricePointServiceEvents.FAIL);
  }

  async create(product_id: number, value: number) : Promise<PricePoint> {
    return await this.error(async () => {
      const product = await this.productService.find(product_id, []);
      if (!product) return;
      const pricePoint = new PricePoint();
      pricePoint.value = value;
      const result = await this.pricePointRepository.create(pricePoint);
      result.product = product;
      await this.pricePointRepository.save(result);

      await this.eventBusService.emit(PricePointServiceEvents.CREATED, result);
      return result;
    });
  }

  async reset(product_id) : Promise<boolean> {
    return await this.error(async () => {
      const pricePoints = await this.pricePointRepository.find({
        where: { product: { id: product_id } },
        relations: ['product'],
      });
      if (!pricePoints || pricePoints.length === 0) return;
      const tmp_price = pricePoints[0].product.initial_value;
      await this.pricePointRepository.remove(pricePoints);
      await this.create(product_id, tmp_price);
      await this.eventBusService.emit(
        PricePointServiceEvents.RESET,
        product_id
      );
      return true;
    });
  }
}

export default PricePointService;
