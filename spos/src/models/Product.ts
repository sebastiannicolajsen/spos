import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
  BeforeInsert,
} from 'typeorm';
import { PricePointRepository } from '../repositories/PricePointRepository';
import { PricePoint } from './PricePoint';
import { Transaction } from './Transaction';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  timestamp: Date;

  @OneToMany(() => PricePoint, (pp) => pp.product, { onDelete: 'CASCADE' })
  price_points: PricePoint[];

  @ManyToMany(() => Transaction, { onDelete: 'CASCADE' })
  @JoinTable()
  transactions: Transaction[];

  @Column({ type: 'decimal', precision: 7, scale: 2, default: 0.0 })
  initial_value: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, default: 0.0 })
  minimum_value: number;

  @BeforeInsert()
  async setTimestamp() {
    this.timestamp = new Date();
  }
}
