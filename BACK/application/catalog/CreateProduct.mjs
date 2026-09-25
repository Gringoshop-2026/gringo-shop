import { createProduct } from '../../domain/entities/Product.mjs'
export const createProductUseCase = (repository, input) => repository.save(createProduct(input))
