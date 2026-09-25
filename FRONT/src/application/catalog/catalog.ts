import type { Product } from '../../domain/catalog/Product'
export const reservationAmount = (product: Product) => product.price * (product.reservationPercent / 100)
