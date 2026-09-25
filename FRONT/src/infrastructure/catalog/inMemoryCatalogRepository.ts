import type { Product } from '../../domain/catalog/entities/Product'
import type { CatalogRepository } from '../../application/catalog/getFeaturedProducts'

const featured: Product[] = []

export class InMemoryCatalogRepository implements CatalogRepository {
  getFeatured() { return featured }
}
