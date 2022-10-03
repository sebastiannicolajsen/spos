import { AppDataSource } from "../../repositories/data-source"
import { Seller, UserRole} from "../../models/Seller"
import { SellerRepository } from "../../repositories/SellerRepository"

// typescript instantiate admin user
export const sellers = async () => {
    const admin = new Seller()
    admin.username = "admin"
    admin.role = UserRole.ADMIN
    admin.password = "supersecret"

    await SellerRepository.create(admin)
    await SellerRepository.save(admin)

    const user = new Seller();
    user.username = "default"
    user.role = UserRole.DEFAULT
    user.password = "supersecret"

    await SellerRepository.create(user)
    await SellerRepository.save(user)
}