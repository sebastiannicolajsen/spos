import Container from "typedi";
import { Seller } from "../models/Seller"
import { AppDataSource } from "./data-source"

export const SellerRepositoryId = "SellerRepository";
export const SellerRepository = AppDataSource.getRepository(Seller)
Container.set(SellerRepositoryId, SellerRepository);