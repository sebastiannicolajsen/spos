import _ = require('lodash');
import { Inject, Service } from 'typedi';
import { Seller, SellerRole } from '../models/Seller';
import {
  SellerRepository,
  SellerRepositoryId,
} from '../repositories/SellerRepository';
import BaseService from './BaseService';

import EventBusService from './EventBusService';

export enum SellerServiceEvents {
  CREATED = 'user.created',
  UPDATED = 'user.updated',
  DELETED = 'user.deleted',
  FAIL = 'user.fail',
}

@Service()
class SellerService extends BaseService {
  constructor(
    @Inject()
    protected readonly eventBusService: EventBusService,
    @Inject(SellerRepositoryId)
    protected readonly sellerRepository: typeof SellerRepository
  ) {
    super(eventBusService, SellerServiceEvents.FAIL);
  }

  async find(username: string): Promise<Seller> {
    return _.omit(await this.findUnsafe(username), ['password']) as Seller;
  }

  async findUnsafe(username: string): Promise<Seller> {
    return await this.error(async () => {
      const user = await this.sellerRepository.findOne({ where: { username } });
      if (!user) return null;

      return user;
    });
  }

  async get(): Promise<Seller[]> {
    return await this.error(async () => {
      return (await this.sellerRepository.find()).map((u) => _.omit(u, ['password']));
    });
  }

  async delete(username: string): Promise<boolean> {
    return await this.error(async () => {
      const user = await this.sellerRepository.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        return false;
      }

      await this.sellerRepository.delete(user.id);
      await this.eventBusService.emit(SellerServiceEvents.DELETED, {
        username: user.username,
      });
      return true;
    });
  }

  async create(
    username: string,
    password: string,
    role: SellerRole
  ): Promise<Seller> {
    return await this.error(async () => {
      const existing = await this.sellerRepository.findOne({
        where: { username },
      });
      if (existing) return Promise.reject('User already exists');

      const user = new Seller();
      user.username = username;
      user.password = password;
      user.role = role;

      await this.sellerRepository.create(user);
      await this.sellerRepository.save(user);

      await this.eventBusService.emit(SellerServiceEvents.CREATED, {
        username: user.username,
      });

      return _.omit(user, ['password']);
    });
  }

  async update(username: string, role: SellerRole): Promise<Seller> {
    return await this.error(async () => {
      const user = await this.sellerRepository.findOne({ where: { username } });
      if (!user) return Promise.reject('User does not exist');

      user.role = role;

      await this.sellerRepository.save(user);

      await this.eventBusService.emit(SellerServiceEvents.UPDATED, {
        username: user.username,
      });

      return _.omit(user, ['password']);
    });
  }
}

export default SellerService;
