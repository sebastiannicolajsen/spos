import Container from "typedi";
import { Transformation } from "../models/Transformation"
import { AppDataSource } from "./data-source"

export const TransformationRepositoryId = "TransformationRepository";
export const TransformationRepository = AppDataSource.getRepository(Transformation)
Container.set(TransformationRepositoryId, TransformationRepository);