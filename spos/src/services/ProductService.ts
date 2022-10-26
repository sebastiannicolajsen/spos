import { Inject, Service } from 'typedi';
import * as _ from 'lodash';
import EventBusService from './EventBusService';
import {
  ProductRepository,
  ProductRepositoryId,
} from '../repositories/ProductRepository';
import { Product } from '../models/Product';
import BaseService from './BaseService';

export enum ProductServiceEvents {
  CREATE = 'product.create',
  UPDATE = 'product.update',
  DELETE = 'product.delete',
  FAIL = 'product.fail',
}

const defaultRelations = ['price_points', 'transactions'];

@Service()
class ProductService extends BaseService {
  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject(ProductRepositoryId)
    private readonly productRepository: typeof ProductRepository
  ) {
    super(eventBusService, ProductServiceEvents.FAIL);
  }

  async create(
    name: string,
    initial_value: number,
    minimum_value: number
  ): Promise<Product> {
    return await this.error(async () => {
      const product = new Product();
      product.name = name;
      product.initial_value = initial_value;
      product.minimum_value = minimum_value;

      const result = await this.productRepository.create(product);
      await this.productRepository.save(result);

      await this.eventBusService.emit(ProductServiceEvents.CREATE, result);
      return result;
    });
  }

  async find(id: number, relations = defaultRelations): Promise<Product> {
    return await this.error(async () => {
      return this.productRepository.findOne({ where: { id }, relations });
    });
  }

  async get(relations = defaultRelations): Promise<Product[]> {
    return await this.error(async () => {
      return this.productRepository.find({ relations });
    });
  }

  async findByName(
    name: string,
    relations = defaultRelations
  ): Promise<Product> {
    return await this.error(async () => {
      return this.productRepository.findOne({ where: { name }, relations });
    });
  }

  async update(
    id: number,
    toUpdate = { name: null, initial_value: null, minimum_value: null }
  ): Promise<Product> {
    return await this.error(async () => {
      const product = await this.find(id);
      if (!product) return;
      const { name, initial_value, minimum_value } = toUpdate;
      if (name) product.name = name;
      if (initial_value) product.initial_value = initial_value;
      if (minimum_value) product.minimum_value = minimum_value;

      await this.productRepository.save(product);

      await this.eventBusService.emit(ProductServiceEvents.UPDATE, product);
      return product;
    });
  }

  async delete(id: number): Promise<boolean> {
    return await this.error(async () => {
      const product = await this.find(id);

      if (!product) return;
      const tmp = _.cloneDeep(product);

      await this.productRepository.delete(product.id);

      await this.eventBusService.emit(ProductServiceEvents.DELETE, tmp);
      return true;
    });
  }
}

export default ProductService;
