import { createOrder } from '../../domain/entities/Order.mjs'
export const createOrderUseCase = (repository, input) => repository.addOrder(createOrder(input))
