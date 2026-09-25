export function createProduct(input) {
  if (!input.name?.trim()) throw new Error('El producto necesita un nombre')
  if (!input.category?.trim()) throw new Error('El producto necesita una categoría')
  if (!Number.isFinite(Number(input.price)) || Number(input.price) <= 0) throw new Error('El precio debe ser mayor que cero')
  return { id: input.id || crypto.randomUUID(), name: input.name.trim(), brand: input.brand?.trim() || 'Marca no especificada', category: input.category.trim(), price: Number(input.price), referencePrice: Number(input.referencePrice || 0), image: input.image || '', reservationPercent: 50, active: input.active !== false, createdAt: input.createdAt || new Date().toISOString() }
}
