import { Inject, Service } from "typedi"
import { Seller, SellerRole } from "../models/Seller"
import { SellerRepository, SellerRepositoryId } from "../repositories/SellerRepository"
import EventBusService from "./EventBusService"

@Service()
class SellerService {

    static Events = {
        CREATED: "user.created",
        UPDATED: "user.updated",
        DELETED: "user.deleted"
    }

    constructor(
        @Inject()
        protected readonly eventBusService: EventBusService,
        @Inject(SellerRepositoryId)
        protected readonly sellerRepository: typeof SellerRepository,
        ) {
        this.sellerRepository = sellerRepository
    }

    async get(username: string): Promise<Seller> {
        const user = await this.sellerRepository.findOne({ where: { username }})
        if(!user) return Promise.reject("User does not exist")

        return user
    }
    
    async all(): Promise<Seller[]> {
        return this.sellerRepository.find()
    }

    async delete(username: string): Promise<void> {
        const user = await this.sellerRepository.findOne({
            where: {
                username
            }
        })

        if(!user){
            return Promise.resolve()
        }

        await this.sellerRepository.delete(user.id)
        await this.eventBusService.emit(SellerService.Events.DELETED, { username: user.username })
    }

    async create(username: string, password: string, role: SellerRole) : Promise<Seller> {
        const existing = await this.sellerRepository.findOne({ where: { username }})
        if(existing) return Promise.reject("User already exists")

        const user = new Seller()
        user.username = username
        user.password = password
        user.role = role

        await this.sellerRepository.create(user)
        await this.sellerRepository.save(user)

        await this.eventBusService.emit(SellerService.Events.CREATED, { username: user.username })

        return user
    }

    async update(username: string, role: SellerRole) : Promise<Seller> {
        const user = await this.sellerRepository.findOne({ where: { username }})
        if(!user) return Promise.reject("User does not exist")

        user.role = role

        await this.sellerRepository.save(user)

        await this.eventBusService.emit(SellerService.Events.UPDATED, {username: user.username})

        return user
    }

}

export default SellerService