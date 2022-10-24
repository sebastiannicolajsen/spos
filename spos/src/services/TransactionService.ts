import _ = require('lodash');
import { Inject, Service } from 'typedi';
import { PricePoint } from '../models/PricePoint';
import { Product } from '../models/Product';
import { Seller } from '../models/Seller';
import { Item, ShallowItem, Transaction } from '../models/Transaction';
import {
  TransactionRepository,
  TransactionRepositoryId,
} from '../repositories/TransactionRepository';
import BaseService from './BaseService';
import EventBusService from './EventBusService';

export enum TransactionServiceEvents {
  CREATE = 'transaction.create',
  FAIL = 'transaction.fail',
}

const defaultRelations = ['seller', 'products_', 'price_points_'];

@Service()
class TransactionService extends BaseService {
  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject(TransactionRepositoryId)
    private readonly transactionRepository: typeof TransactionRepository
  ) {
    super(eventBusService, TransactionServiceEvents.FAIL);
  }

  async create(seller_id: number, items: ShallowItem[]) : Promise<Transaction> {
    return await this.error(async () => {
      const transaction = new Transaction();
      transaction.seller = { id: seller_id } as Seller;
      console.log(transaction.seller);
      transaction.products_ = items.map(
        (item) => ({ id: item.product_id } as Product)
      );
      transaction.price_points_ = items.map(
        (item) => ({ id: item.price_point_id } as PricePoint)
      );
      transaction.quantity_ = JSON.stringify(
        items.map((item) => item.quantity)
      );

      const result = await this.transactionRepository.create(transaction);
      if (!result) return;
      await this.transactionRepository.save(result);

      await this.eventBusService.emit(TransactionServiceEvents.CREATE, result);
      return true;
    });
  }

  private unwrap(transaction: Transaction) {
    const { products_, price_points_, quantity_ } = transaction;
    const items = JSON.parse(quantity_).map((quantity: number, i: number) => ({
      product: products_[i],
      price_point: price_points_[i],
      quantity,
    })) as Item[];

    const total = items.reduce(
      (sum, item) => sum + item.price_point.value * item.quantity,
      0
    );

    return {
      id: transaction.id,
      timestamp: transaction.timestamp,
      seller: _.omit(transaction.seller, ['password']),
      items,
      total,
    };
  }

  async get(relations = defaultRelations) : Promise<Transaction[]> {
    return await this.error(async () => {
      return (await this.transactionRepository.find({ relations })).map(
        this.unwrap
      );
    });
  }

  async find(id: number, relations = defaultRelations) : Promise<Transaction> {
    return await this.error(async () => {
      return this.unwrap(
        await this.transactionRepository.findOne({ where: { id }, relations })
      );
    });
  }

  async delete(id: number) : Promise<boolean> {
    return await this.error(async () => {
      const transaction = await this.find(id);
      if (!transaction) return;
      await this.transactionRepository.delete(id);
      return true;
    });
  }
}

export default TransactionService;
