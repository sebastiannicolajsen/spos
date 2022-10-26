import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm"
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

    @OneToMany(() => Transaction, (t) => t.seller)
    transactions: Transaction[]

    @Column()
    role: SellerRole = SellerRole.DEFAULT


    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }


}
