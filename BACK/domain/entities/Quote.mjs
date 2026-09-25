export function createQuote(input) {
  if (!input.name?.trim()) throw new Error('La cotización necesita el nombre del producto')
  const phone = String(input.phone || '').replace(/\D/g, '')
  if (!input.customer?.trim()) throw new Error('La cotización necesita el nombre del cliente')
  if (!/^9\d{8}$/.test(phone)) throw new Error('El WhatsApp debe tener 9 dígitos y comenzar con 9')
  return { id: crypto.randomUUID(), customer: input.customer.trim(), phone, name: input.name.trim(), link: input.link?.trim() || null, notes: input.notes?.trim() || null, status: 'pending', createdAt: new Date().toISOString() }
}
export function changeQuoteStatus(quote, status) { if (!['pending','contacted','closed'].includes(status)) throw new Error('Estado de cotización inválido'); return { ...quote, status, updatedAt: new Date().toISOString() } }
