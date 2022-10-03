import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from "typeorm"
import { PricePoint } from "./PricePoint"
import { Product } from "./Product"
import { Seller } from "./Seller"

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    timestamp: Date

    @OneToMany(() => Seller, (s) => s.transactions)
    seller: Seller

    @ManyToMany(() => Product)
    @JoinTable()
    product: Product[]

    @ManyToMany(() => PricePoint)
    @JoinTable()
    price_points: PricePoint[]

    @Column()
    value: number

}
