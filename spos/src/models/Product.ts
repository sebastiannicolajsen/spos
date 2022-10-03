import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from "typeorm"
import { PricePoint } from "./PricePoint"
import { Transaction } from "./Transaction"

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    timestamp: Date

    @OneToMany(() => PricePoint, (pp) => pp.product)
    price_points: PricePoint[]

    @ManyToMany(() => Transaction)
    @JoinTable()
    transactions: Transaction[]

    @Column()
    value: number

}
