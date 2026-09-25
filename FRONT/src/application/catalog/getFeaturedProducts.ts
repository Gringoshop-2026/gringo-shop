import type { Product } from '../../domain/catalog/entities/Product'

export interface CatalogRepository { getFeatured(): Product[] }

export const getFeaturedProducts = (repository: CatalogRepository) => repository.getFeatured()
