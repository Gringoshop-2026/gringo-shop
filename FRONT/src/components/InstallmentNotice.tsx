import { MessageCircle } from 'lucide-react'

export default function InstallmentNotice({ whatsapp, productName }: { whatsapp?: string; productName?: string }) {
  const number = whatsapp?.replace(/\D/g, '')
  const message = productName
    ? `Hola, quiero consultar las opciones para comprar en cuotas el producto ${productName}.`
    : 'Hola, quiero consultar las opciones para comprar en cuotas.'
  return <div className="installment-notice"><div><strong>¿Quieres comprar en cuotas?</strong><p>Comunícate con nosotros por WhatsApp para consultar las opciones.</p></div>{number && <a href={`https://wa.me/51${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="text-button"><MessageCircle size={17}/>Consultar por WhatsApp</a>}</div>
}
