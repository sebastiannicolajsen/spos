import { Container } from "typedi"
import { PricePoint } from "../models/PricePoint"
import { AppDataSource } from "./data-source"

export const PricePointRepositoryId = "PricePointRepository";
export const PricePointRepository = AppDataSource.getRepository(PricePoint)
Container.set(PricePointRepositoryId, PricePointRepository);