import { User } from "../models/User"
import { AppDataSource } from "./data-source"

export const UserRepository = AppDataSource.getRepository(User)