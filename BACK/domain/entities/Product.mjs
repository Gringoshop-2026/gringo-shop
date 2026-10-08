export function normalizeProductImages(input) {
  const images = input.images === undefined ? (input.image ? [input.image] : []) : input.images
  if (!Array.isArray(images) || images.length > 6) throw new Error('El producto admite un máximo de 6 fotos')
  if (images.some(image => typeof image !== 'string' || image.length > 2 * 1024 * 1024 || !/^(data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+|https?:\/\/[^\s]+|\/[^\s]+)$/.test(image))) {
    throw new Error('Las fotos deben ser imágenes válidas y estar optimizadas')
  }
  return images
}

export function createProduct(input) {
  if (!input.name?.trim()) throw new Error('El producto necesita un nombre')
  if (!input.category?.trim()) throw new Error('El producto necesita una categoría')
  if (!Number.isFinite(Number(input.price)) || Number(input.price) <= 0) throw new Error('El precio debe ser mayor que cero')
  const images = normalizeProductImages(input)
  return { id: input.id || crypto.randomUUID(), name: input.name.trim(), brand: input.brand?.trim() || 'Marca no especificada', category: input.category.trim(), price: Number(input.price), referencePrice: Number(input.referencePrice || 0), image: images[0] || '', images, reservationPercent: 50, active: input.active !== false, createdAt: input.createdAt || new Date().toISOString() }
}
