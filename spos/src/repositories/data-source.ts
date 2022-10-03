import "reflect-metadata"
import { DataSource } from "typeorm"
import { PricePoint } from "../models/PricePoint"
import { Product } from "../models/Product"
import { Transaction } from "../models/Transaction"
import { Transformation } from "../models/Transformation"
import { Seller } from "../models/Seller"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "sebni",
    password: "",
    database: "spos",
    synchronize: true,
    logging: false,
    entities: [Seller, Product, PricePoint, Transaction, Transformation],
    migrations: ["/../migration/*.ts"],
    subscribers: []
})
