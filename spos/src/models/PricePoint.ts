import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  BeforeInsert,
} from 'typeorm';
import { Product } from './Product';
import { Transaction } from './Transaction';

@Entity()
export class PricePoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @ManyToOne(() => Product, (p) => p.price_points, {onDelete: 'CASCADE'})
  product: Product;

  @ManyToMany(() => Transaction)
  @JoinTable()
  transactions: Transaction[];

  @Column({ type: 'decimal', precision: 7, scale: 2, default: 0.0 })
  value: number;

  @BeforeInsert()
  beforeInsert() {
    this.timestamp = new Date();
  }
}
