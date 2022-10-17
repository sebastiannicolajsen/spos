import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, BeforeInsert } from "typeorm"
import { PricePointRepository } from "../repositories/PricePointRepository"
import { PricePoint } from "./PricePoint"
import { Transaction } from "./Transaction"

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    timestamp: Date

    @OneToMany(() => PricePoint, (pp) => pp.product)
    price_points: PricePoint[]

    @ManyToMany(() => Transaction)
    @JoinTable()
    transactions: Transaction[]

    @Column()
    initial_value: number

    @Column()
    minimum_value: number

    @BeforeInsert()
    async setTimestamp() {
        this.timestamp = new Date()
    }


}
