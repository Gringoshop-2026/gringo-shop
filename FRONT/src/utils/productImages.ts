export const MAX_PRODUCT_PHOTOS = 6
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const MAX_OPTIMIZED_BYTES = 1024 * 1024

export async function optimizeProductImage(source: Blob): Promise<string> {
  const bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' })
  try {
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')
    if (!context) throw new Error('No pudimos procesar la foto. Intenta con otro archivo.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const encode = (quality: number) => new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('No pudimos optimizar la foto.')), 'image/webp', quality))
    let blob = await encode(.82)
    if (blob.size > MAX_OPTIMIZED_BYTES) blob = await encode(.65)
    if (blob.size > MAX_OPTIMIZED_BYTES) {
      const reduced = document.createElement('canvas')
      reduced.width = Math.max(1, Math.round(canvas.width * .65))
      reduced.height = Math.max(1, Math.round(canvas.height * .65))
      reduced.getContext('2d')!.drawImage(canvas, 0, 0, reduced.width, reduced.height)
      blob = await new Promise<Blob>((resolve, reject) => reduced.toBlob(value => value ? resolve(value) : reject(new Error('No pudimos optimizar la foto.')), 'image/webp', .65))
    }
    if (blob.size > MAX_OPTIMIZED_BYTES) throw new Error('La foto sigue siendo demasiado grande. Prueba con otra imagen.')
    return await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('No pudimos leer la foto.')); reader.readAsDataURL(blob) })
  } finally { bitmap.close() }
}
