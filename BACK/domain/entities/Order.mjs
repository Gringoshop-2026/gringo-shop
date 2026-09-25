const allowed = new Set(['reserved', 'confirmed', 'cancelled', 'completed'])
export function createOrder(input) {
  if (!input.productName?.trim()) throw new Error('La reserva necesita un producto')
  if (!input.customer?.trim()) throw new Error('La reserva necesita el nombre del cliente')
  if (!input.phone?.trim()) throw new Error('La reserva necesita un teléfono')
  const phone = input.phone.trim()
  if (!/^9\d{8}$/.test(phone)) throw new Error('El WhatsApp debe tener 9 dígitos y comenzar con 9')
  return { id: `GS-${Date.now()}`, productName: input.productName.trim(), customer: input.customer.trim(), phone, status: 'reserved', createdAt: new Date().toISOString() }
}
export function changeOrderStatus(order, status) { if (!allowed.has(status)) throw new Error('Estado de reserva inválido'); return { ...order, status, updatedAt: new Date().toISOString() } }
