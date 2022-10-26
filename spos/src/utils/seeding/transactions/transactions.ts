import { PricePoint } from '../../../models/PricePoint';
import { Product } from '../../../models/Product';
import { Seller } from '../../../models/Seller';
import { Transaction } from '../../../models/Transaction';
import { TransactionRepository } from '../../../repositories/TransactionRepository';

// typescript instantiate admin user
export const transactions = async () => {
  const transaction = new Transaction();
  transaction.seller = { id: 1 } as Seller;
  transaction.products_ = [{ id: 1 } as Product];
  transaction.quantity_ = '[1]';
  transaction.price_points_ = [{ id: 1 } as PricePoint];

  await TransactionRepository.create(transaction);
  await TransactionRepository.save(transaction);
};
