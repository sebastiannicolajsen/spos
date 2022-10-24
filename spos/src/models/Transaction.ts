import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  ManyToOne,
} from 'typeorm';
import { PricePoint } from './PricePoint';
import { Product } from './Product';
import { Seller } from './Seller';

export type Item = {
  product: Product;
  price_point: PricePoint;
  quantity: number;
};

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Seller, (s) => s.transactions)
  seller: Seller;

  items: Item[];

  @ManyToMany(() => Product)
  @JoinTable()
  products_: Product[];

  @ManyToMany(() => PricePoint)
  @JoinTable()
  price_points_: PricePoint[];

  @Column()
  quantity_: string;

  total: number;

  @BeforeInsert()
  async beforeInsert() {
    this.timestamp = new Date();
  }
}
