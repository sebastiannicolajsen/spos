import { Seller } from "../models/Seller"
import { AppDataSource } from "./data-source"

export const SellerRepository = AppDataSource.getRepository(Seller)