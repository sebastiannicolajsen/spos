import { Inject, Service } from 'typedi';
import * as _ from 'lodash';
import {
  PricePointRepository,
  PricePointRepositoryId,
} from '../repositories/PricePointRepository';
import EventBusService from './EventBusService';
import ProductService from './ProductService';

export enum PricePointServiceEvents {
  CREATED = 'pricepoint.created',
  RESET = 'pricepoint.reset',
}

@Service()
class PricePointService {
  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject()
    private readonly productService: ProductService,
    @Inject(PricePointRepositoryId)
    private readonly pricePointRepository: typeof PricePointRepository
  ) {}

  async create(product_id: number, value: number) {
    const product = await this.productService.find(product_id, []);
    if (!product) return;
    const pricePoint = await this.pricePointRepository.create({ value });
    pricePoint.product = product;
    await this.pricePointRepository.save(pricePoint);

    await this.eventBusService.emit(
      PricePointServiceEvents.CREATED,
      pricePoint
    );
    return pricePoint;
  }

  async reset(product_id) {
    const pricePoints = await this.pricePointRepository.find({
      where: { product: { id: product_id } },
      relations: ['product'],
    });
    if (!pricePoints || pricePoints.length === 0) return;
    const tmp_price = pricePoints[0].product.initial_value;
    await this.pricePointRepository.remove(pricePoints);
    await this.create(product_id, tmp_price);
    await this.eventBusService.emit(PricePointServiceEvents.RESET, product_id);
  }
}

export default PricePointService;
