import Container from "typedi";
import { Transaction } from "../models/Transaction"
import { AppDataSource } from "./data-source"

export const TransactionRepositoryId = "TransactionRepository";
export const TransactionRepository = AppDataSource.getRepository(Transaction)
Container.set(TransactionRepositoryId, TransactionRepository);