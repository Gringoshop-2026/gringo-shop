export function shopWhatsappUrl(phone: string, message: string): string | undefined {
  const digits = phone.replace(/\D/g, '')
  const number = /^9\d{8}$/.test(digits) ? `51${digits}` : /^519\d{8}$/.test(digits) ? digits : undefined
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : undefined
}
