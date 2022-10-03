import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable } from "typeorm"
import { Product } from "./Product"
import { Transaction } from "./Transaction"

@Entity()
export class PricePoint {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    timestamp: Date

    @ManyToOne(() => Product, (p) => p.price_points)
    product: Product

    @ManyToMany(() => Transaction)
    @JoinTable()
    transactions: Transaction[]

    @Column()
    value: number

}
