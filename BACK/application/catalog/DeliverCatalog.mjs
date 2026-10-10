import { createHash } from 'node:crypto'
export function photoVersion(photo) { return createHash('sha256').update(photo).digest('hex').slice(0, 20) }
export function productPhotos(product) { return product.images?.length ? product.images : product.image ? [product.image] : [] }
export function deliverProduct(product, baseUrl) {
  const photos = productPhotos(product).map((photo, index) => {
    if (!photo.startsWith('data:')) return photo
    const version = photoVersion(photo)
    return `${baseUrl}/api/products/${encodeURIComponent(product.id)}/images/${index}?v=${version}`
  })
  return { ...product, image: photos[0] || '', images: photos }
}
export function decodeProductPhoto(photo) {
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(photo)
  return match ? { type: match[1], bytes: Buffer.from(match[2], 'base64') } : undefined
}
