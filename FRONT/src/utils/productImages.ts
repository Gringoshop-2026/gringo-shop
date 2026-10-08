export const MAX_PRODUCT_PHOTOS = 6
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const MAX_OPTIMIZED_BYTES = 1024 * 1024

export function isHeicPhoto(source: Blob & { name?: string }): boolean {
  return /^image\/(heic|heif)(-sequence)?$/i.test(source.type) || /\.hei[cf]$/i.test(source.name || '')
}

export function isSupportedProductPhoto(source: Blob & { name?: string }): boolean {
  return ['image/png', 'image/jpeg', 'image/webp'].includes(source.type) || isHeicPhoto(source)
}

export async function optimizeProductImage(source: Blob & { name?: string }): Promise<string> {
  let decoded = source
  if (isHeicPhoto(source)) {
    try {
      const { heicTo } = await import('heic-to/csp')
      decoded = await heicTo({ blob: source, type: 'image/jpeg', quality: .95 })
    } catch {
      throw new Error('No pudimos convertir esta foto HEIC. Intenta con otra foto o expórtala como JPG.')
    }
  }
  const bitmap = await createImageBitmap(decoded, { imageOrientation: 'from-image' })
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('No pudimos procesar la foto. Intenta con otro archivo.')
    const encode = (quality: number) => new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('No pudimos optimizar la foto.')), 'image/webp', quality))
    let longestSide = Math.min(1600, Math.max(bitmap.width, bitmap.height))
    let blob: Blob
    while (true) {
      const scale = longestSide / Math.max(bitmap.width, bitmap.height)
      canvas.width = Math.max(1, Math.round(bitmap.width * scale))
      canvas.height = Math.max(1, Math.round(bitmap.height * scale))
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
      blob = await encode(.82)
      // Safari may return PNG when WebP encoding is unavailable; quality has no effect on PNG.
      if (blob.type !== 'image/png') {
        for (const quality of [.65, .5]) {
          if (blob.size <= MAX_OPTIMIZED_BYTES) break
          blob = await encode(quality)
        }
      }
      if (blob.size <= MAX_OPTIMIZED_BYTES) break
      if (longestSide <= 320) throw new Error('No pudimos optimizar esta foto. Intenta exportarla como JPG.')
      longestSide = Math.max(320, Math.round(longestSide * .75))
    }
    return await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('No pudimos leer la foto.')); reader.readAsDataURL(blob) })
  } finally { bitmap.close() }
}
