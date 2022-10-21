import { Container } from "typedi"
import { Subscriber } from "../models/Subscriber"
import { AppDataSource } from "./data-source"

export const SubscriberRepositoryId = "SubscriberRepository";
export const SubscriberRepository = AppDataSource.getRepository(Subscriber)
Container.set(SubscriberRepositoryId, SubscriberRepository);