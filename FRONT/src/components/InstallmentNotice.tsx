import { MessageCircle } from 'lucide-react'

export default function InstallmentNotice({ whatsapp, productName }: { whatsapp?: string; productName?: string }) {
  const number = whatsapp?.replace(/\D/g, '')
  const message = productName
    ? `Hola, quiero consultar los medios de pago para comprar el producto ${productName}.`
    : 'Hola, quiero consultar los medios de pago disponibles.'
  return <div className="installment-notice"><div><strong>Coordina con nosotros los distintos medios de pago</strong><p>Escríbenos por WhatsApp y te ayudamos a elegir cómo pagar tu compra.</p></div>{number && <a href={`https://wa.me/51${number}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer" className="text-button"><MessageCircle size={17}/>Consultar por WhatsApp</a>}</div>
}
