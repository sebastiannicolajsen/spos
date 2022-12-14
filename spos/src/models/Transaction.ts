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

export type ShallowItem = {
  product_id: number;
  price_point_id: number;
  quantity: number;
};

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Seller, (s) => s.transactions, { onDelete: 'CASCADE' })
  seller: Seller;

  items: Item[];

  @ManyToMany(() => Product, {onDelete: 'CASCADE'})
  @JoinTable()
  products_: Product[];

  @ManyToMany(() => PricePoint, { onDelete: 'CASCADE'})
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
