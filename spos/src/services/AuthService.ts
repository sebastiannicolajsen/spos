import { Inject, Service } from 'typedi';
import EventBusService from './EventBusService';
import SellerService from './SellerService';
import * as bcrypt from 'bcrypt';
import BaseService from './BaseService';

export enum AuthServiceEvents {
  VALIDATE = 'auth.validate',
  FAIL = 'auth.fail',
}

@Service()
class AuthService extends BaseService {
  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject()
    private readonly sellerService: SellerService
  ) {
    super(eventBusService, AuthServiceEvents.FAIL);
  }

  async validate(username: string, password: string): Promise<boolean> {
    return await this.error(async () => {
      const user = await this.sellerService.get(username);

      if (!user) return Promise.resolve(false);

      const isValid = await bcrypt.compare(password, user.password);

      await this.eventBusService.emit(AuthServiceEvents.VALIDATE, {
        username,
        isValid,
      });
      return isValid;
    });
  }
}

export default AuthService;
