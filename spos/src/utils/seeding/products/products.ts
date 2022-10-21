import { Product } from "../../../models/Product"
import { PricePointRepository } from "../../../repositories/PricePointRepository"
import { ProductRepository } from "../../../repositories/ProductRepository"

// typescript instantiate admin user
export const products = async () => {
    const product = new Product()
    product.name = "product"
    product.initial_value = 100
    product.minimum_value = 10

    await ProductRepository.create(product)
    await ProductRepository.save(product)

    const pp = await PricePointRepository.create({product, value: product.initial_value});
    await PricePointRepository.save(pp);
}