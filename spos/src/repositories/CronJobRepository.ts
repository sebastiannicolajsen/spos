import { Container } from "typedi"
import { CronJob } from "../models/CronJob"
import { AppDataSource } from "./data-source"

export const CronJobRepositoryId = "CronJobRepository";
export const CronJobRepository = AppDataSource.getRepository(CronJob)
Container.set(CronJobRepositoryId, CronJobRepository);