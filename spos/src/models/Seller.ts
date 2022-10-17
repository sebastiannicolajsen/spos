import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne } from "typeorm"
import * as bcrypt from "bcrypt"
import { Transaction } from "./Transaction"

export enum SellerRole {
    DEFAULT = "DEFAULT",
    ADMIN = "ADMIN",
}

@Entity()
export class Seller {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @ManyToOne(() => Transaction, (t) => t.seller)
    transactions: Transaction[]

    @Column()
    role: SellerRole = SellerRole.DEFAULT


    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }


}
