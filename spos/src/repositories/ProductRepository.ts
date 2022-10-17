import Container from "typedi";
import { Product } from "../models/Product"
import { AppDataSource } from "./data-source"

export const ProductRepositoryId = "ProductRepository";
export const ProductRepository = AppDataSource.getRepository(Product)
Container.set(ProductRepositoryId, ProductRepository);