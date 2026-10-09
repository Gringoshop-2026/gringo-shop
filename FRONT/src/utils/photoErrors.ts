export function photoProcessingError(error: unknown, photo: number, stage: string): string {
  const detail = error instanceof Error ? error.message : String(error || '')
  let advice = 'Vuelve a intentarlo. Si se repite, comparte el detalle de abajo para revisar la causa.'
  if (/fetch|network|load failed|download|Failed to load module|dynamically imported/i.test(detail)) {
    advice = 'No se pudo descargar un recurso necesario. Revisa tu conexión y si el navegador bloquea las descargas; luego vuelve a intentarlo.'
  } else if (/memory|allocation|out of bounds|out of memory/i.test(detail)) {
    advice = 'El navegador se quedó sin memoria al procesar la imagen. Cierra otras pestañas y vuelve a intentarlo con una foto de menor resolución.'
  } else if (/webassembly|wasm|backend|session|webgpu|unsupported|not supported/i.test(detail)) {
    advice = 'El motor de recorte no pudo iniciarse o ejecutar la imagen en este navegador. Recarga la página o prueba con un navegador actualizado.'
  } else if (/decode|bitmap|image format|invalid image/i.test(detail)) {
    advice = 'No se pudo leer la imagen. Expórtala como JPG o PNG y vuelve a cargarla.'
  }
  const safeDetail = detail.replace(/https?:\/\/[^\s]+/g, '[recurso externo]').slice(0, 350)
  return `Foto ${photo}: falló ${stage}. ${advice}${safeDetail ? ` Detalle: ${safeDetail}` : ''} Tus fotos siguen cargadas en el formulario.`
}
