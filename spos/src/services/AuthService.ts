import { Inject, Service } from "typedi"
import EventBusService from "./EventBusService"
import SellerService from "./SellerService"
import * as bcrypt from "bcrypt"

@Service()
class AuthService {
    Events = {
        VALIDATE: "validate"
    }

    constructor(
        @Inject()
        private readonly eventBusService: EventBusService,
        @Inject()
        private readonly sellerService: SellerService) {
    }

    async validate(username: string, password: string): Promise<boolean> {
        const user = await this.sellerService.get(username)

        if(!user) return Promise.resolve(false)

        const isValid = await bcrypt.compare(password, user.password)

        await this.eventBusService.emit(this.Events.VALIDATE, { username, isValid })
        return isValid
    }
}

export default AuthService