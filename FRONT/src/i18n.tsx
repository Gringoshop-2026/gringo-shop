import { Languages } from 'lucide-react'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'es' | 'en'

const translations = {
  es: { language: 'Idioma', spanish: 'Español', english: 'English' },
  en: { language: 'Language', spanish: 'Spanish', english: 'English' },
} as const

const englishText: Record<string, string> = {
  'Reservar por WhatsApp': 'Reserve on WhatsApp',
  'Cotizar por WhatsApp': 'Get a quote on WhatsApp',
  'Contacto': 'Contact',
  'Hablemos por WhatsApp': 'Let’s chat on WhatsApp',
  'Consulta por un producto, tu compra o las opciones de pago.': 'Ask about a product, your purchase or payment options.',
  'Escribir por WhatsApp': 'Chat on WhatsApp',
  'Escríbenos por WhatsApp y coordinamos tu compra.': 'Message us on WhatsApp to arrange your purchase.',
  'El contacto por WhatsApp estará disponible pronto.': 'WhatsApp contact will be available soon.',

  'Tu próxima compra,': 'Your next purchase,',
  'más cerca.': 'closer to you.',
  'Reserva tu producto y coordina': 'Reserve your product and arrange',
  'los detalles por WhatsApp.': 'the details on WhatsApp.',
  'Coordina tu reserva': 'Arrange your reservation',
  'Déjanos tus datos y coordinamos los detalles por WhatsApp.': 'Leave your details and we will arrange everything on WhatsApp.',
  'Recibe tu producto': 'Receive your product',
  'Te acompañamos hasta la entrega de tu compra.': 'We assist you until your purchase is delivered.',
  'Precio del producto': 'Product price',
  'Define la moneda, el mensaje principal y cómo te contactan tus compradores.': 'Set the currency, main message and how buyers contact you.',

  '¿Quieres comprar en cuotas?': 'Want to pay in installments?',
  'Comunícate con nosotros por WhatsApp para consultar las opciones.': 'Contact us on WhatsApp to ask about your options.',
  'Consultar por WhatsApp': 'Ask on WhatsApp',
  'Catálogo': 'Catalog', 'Cómo funciona': 'How it works', 'Mis reservas': 'My reservations',
  'Cotizar': 'Get a quote', 'Buscar producto': 'Search product', 'Control general': 'Dashboard',
  'Publicar producto': 'Publish product', 'Gestionar reservas': 'Manage reservations',
  'Cliente': 'Customer', 'Producto': 'Product', 'WhatsApp': 'WhatsApp', 'Estado': 'Status',
  'Acciones': 'Actions', 'Pendiente': 'Pending', 'Confirmada': 'Confirmed', 'Cancelada': 'Cancelled',
  'Completada': 'Completed', 'Confirmar': 'Confirm', 'Cancelar': 'Cancel', 'Productos': 'Products',
  'Reservas': 'Reservations', 'Cotizaciones': 'Quotes', 'Pendientes': 'Pending', 'Enviar': 'Send',
  'Crear reserva': 'Create reservation', 'Solicitar cotización': 'Request a quote',
  'Nombre del producto': 'Product name', 'Marca': 'Brand', 'Precio NegroShop': 'NegroShop price',
  'Precio de tienda': 'Store price', 'Selecciona una categoría': 'Select a category',
  'Foto del producto': 'Product photo', 'Configuración': 'Settings', 'Guardar configuración': 'Save settings',
  'Modo administrador': 'Administrator mode', 'Todavía no hay cotizaciones.': 'There are no quotes yet.',
  '¿Cómo funciona NegroShop?': 'How does NegroShop work?', 'Transparencia total': 'Total transparency',
  'Encontramos lo que buscas.': 'We will find what you are looking for.', 'FILTRAR': 'FILTER',
  'Limpiar': 'Clear', 'Disponible': 'Available', 'Ocultar': 'Hide', 'Reactivar': 'Reactivate',
  'Editar': 'Edit', 'Clientes': 'Customers', 'Catálogo de productos': 'Product catalog',
  'Pedidos & encargos': 'Orders & requests', 'Ver tienda': 'View store', 'Cerrar sesión': 'Log out',
  'Eliges o cotizas': 'Choose or request a quote', 'Reservas con': 'Reserve with',
  'Pagas el saldo': 'Pay the balance', 'Selecciona del catálogo o envíanos un enlace.': 'Choose from the catalog or send us a link.',
  'Asegura tu compra con la mitad de la cotización.': 'Secure your purchase with half of the quote.',
  'Cancelas el resto al recibir tu producto.': 'Pay the balance when you receive your product.',
  'Catálogo actualizado': 'Catalog updated', 'Traemos tus marcas favoritas directo de USA': 'We bring your favorite brands straight from the USA',
  'Precio directo de tienda oficial.': 'Direct official store price.', 'Reserva': 'Reserve',
  'Reservar con': 'Reserve with', 'Enviar producto para cotizar': 'Send a product for a quote',
  'No está en el catálogo?': 'Not in the catalog?', 'Cargando catálogo…': 'Loading catalog…',
  'productos disponibles': 'products available', 'Solicitudes enviadas por compradores.': 'Requests sent by buyers.',
  'Contactar': 'Contact', 'Cerrar': 'Close', 'Ver enlace': 'View link', 'Sin detalles': 'No details',
  'Mensaje principal': 'Main message', 'Adelanto de reserva (%)': 'Reservation deposit (%)',
  'WhatsApp de la tienda': 'Store WhatsApp', 'Moneda': 'Currency', 'Usuarios y permisos': 'Users and permissions',
  'Contraseña actual': 'Current password', 'Nueva contraseña (8+ caracteres)': 'New password (8+ characters)',
  'Repite la nueva contraseña': 'Repeat new password', 'Guardar': 'Save', 'Nombre': 'Name',
  'Activo': 'Active', 'Oculto': 'Hidden',
  'Compra directo de tiendas de Estados Unidos · Precio claro en soles': 'Buy directly from US stores · Clear prices in soles',
  'No encontramos reservas con ese número.': 'No reservations found for that number.',
  'Ingresa el WhatsApp que usaste al reservar.': 'Enter the WhatsApp number you used to reserve.',
  'Salir': 'Log out', 'Clientes agrupados por número de WhatsApp.': 'Customers grouped by WhatsApp number.',
  'reserva': 'reservation', 'reservas': 'reservations', 'Última actividad:': 'Last activity:',
  'Productos publicados': 'Published products', 'Edita precios o controla qué aparece en la tienda.': 'Edit prices or control what appears in the store.',
  'Seguridad de tu cuenta': 'Account security', 'Cambia tu contraseña de acceso al panel.': 'Change your panel access password.',
  'Cambiar contraseña': 'Change password', 'Copias de seguridad': 'Backups',
  'Descarga una copia de toda la información guardada en SQLite.': 'Download a copy of all information stored in SQLite.',
  'Descargar copia SQLite': 'Download SQLite backup', 'Guardado en el backend': 'Saved to backend',
  'Estos valores se usarán como reglas generales de la tienda.': 'These values are used as general store rules.',
  'Porcentaje que el cliente debe adelantar.': 'Percentage the customer must pay upfront.',
  'Opcional. Debe comenzar con 9 y tener 9 dígitos.': 'Optional. Must start with 9 and contain 9 digits.',
  'Crear usuario': 'Create user', 'Editor': 'Editor', 'Administrador': 'Administrator',
  'Configuración guardada correctamente.': 'Settings saved successfully.',
  'Pedidos & reservas': 'Orders & reservations',

    '7 productos disponibles': '7 products available',
  'Todos': 'All', 'Accesorios': 'Accessories', 'Perfumes': 'Perfumes', 'Sneakers & Calzado': 'Sneakers & Footwear',
  'Tecnología': 'Technology', 'Seguimiento': 'Tracking', 'Consulta tus reservas': 'Check your reservations',
   'Cotizar un producto': 'Request a quote',
  'Ir al catálogo': 'Skip to catalog',
  'De Estados Unidos a tus manos': 'From the United States to your hands',
  'Tus marcas favoritas.': 'Your favorite brands.',
  'Más cerca de ti.': 'Closer to you.',
  'Compra directo de tiendas de Estados Unidos.': 'Shop directly from stores in the United States.',
  'Explorar catálogo': 'Explore catalog',
  'Elige. Reserva. Recibe.': 'Choose. Reserve. Receive.',
  'de adelanto para reservar.': 'upfront to reserve.',
  'El saldo, al recibir tu producto.': 'The balance, when you receive your product.',
  'Así funciona': 'How it works',
  'Encuentra tu próximo favorito': 'Find your next favorite',
  'Explora nuestras marcas y productos.': 'Explore our brands and products.',
  'Buscar en el catálogo': 'Search the catalog',
  'Buscar producto, marca…': 'Search product, brand…',
  'Imagen no disponible': 'Image unavailable',
  'Reservar producto': 'Reserve product',
  '¿Buscas algo más?': 'Looking for something else?',
  'De la tienda a tus manos': 'From the store to your hands',
  'Elige tu producto': 'Choose your product',
  'Encuéntralo en el catálogo o envíanos el enlace de la tienda.': 'Find it in the catalog or send us the store link.',
  'Adelanta el porcentaje indicado en tu cotización para reservar.': 'Pay the deposit shown in your quote to reserve.',
  'Recibe y paga el saldo': 'Receive and pay the balance',
  'Paga el monto restante al recibir tu producto.': 'Pay the remaining amount when you receive your product.',
  'Volver al catálogo': 'Back to catalog',
  'Reserva tu producto': 'Reserve your product',
  '¿Qué te gustaría traer?': 'What would you like to order?',
  'Comparte los detalles y te contactaremos por WhatsApp.': 'Share the details and we will contact you on WhatsApp.',
  'Tu nombre': 'Your name',
  'Tu WhatsApp': 'Your WhatsApp',
  'Nombre y apellido': 'Full name',
  'Usa un número peruano de 9 dígitos que comience con 9.': 'Use a 9-digit Peruvian number starting with 9.',
  'Enlace de la tienda': 'Store link',
  '(opcional)': '(optional)',
  'Detalles': 'Details',
  'Nombre o modelo del producto': 'Product name or model',
  'Talla, color, cantidad…': 'Size, color, quantity…',
  'Solicitar reserva': 'Request reservation',
  'Enviar solicitud': 'Send request',
  'Enviando solicitud…': 'Sending request…',
  'Consultar': 'Search',
  'Buscando…': 'Searching…',
  'Reintentar': 'Try again',
  'No encontramos coincidencias': 'No matches found',
  'Prueba con otra marca o categoría.': 'Try another brand or category.',
  'Pronto habrá nuevos productos': 'New products coming soon',
  'Mientras tanto, envíanos el enlace del producto que buscas.': 'In the meantime, send us a link to the product you want.',
  'Ver todos los productos': 'View all products',
  'No pudimos actualizar el catálogo. Intenta nuevamente en unos momentos.': 'We could not update the catalog. Try again in a few moments.',
  'Acceso al panel': 'Panel access',
  'Iniciar sesión': 'Sign in',
  'Pedidos y reservas': 'Orders and reservations',
  'Contactada': 'Contacted',
  'Cerrada': 'Closed',
  'Todavía no hay reservas.': 'There are no reservations yet.',
  'Configuración de la tienda': 'Store settings',
  'Descargar copia de seguridad': 'Download backup',
  'Cerrar formulario': 'Close form',
  'Cerrar mensaje': 'Dismiss message',
  'Consultar reservas': 'Check reservations',
  'WhatsApp usado para reservar': 'WhatsApp used to reserve',
  'Resumen': 'Overview',
  'Administración': 'Administration',
  'Resumen de tu tienda': 'Your store overview',
  'Todo lo que necesitas para organizar el día.': 'Everything you need to organize your day.',
  'Productos activos': 'Active products',
  'Reservas por confirmar': 'Reservations to confirm',
  'Cotizaciones pendientes': 'Pending quotes',
  'Total de clientes': 'Total customers',
  'Ver detalle': 'View details',
  'Todo al día': 'All up to date',
  'Hay solicitudes por atender': 'Requests need your attention',
  'Las nuevas solicitudes de tus clientes aparecerán aquí.': 'New customer requests will appear here.',
  'Ver cotizaciones': 'View quotes',
  'Solicitudes que necesitan tu atención.': 'Requests that need your attention.',
  'Ver todas': 'View all',
  'Listado de reservas': 'Reservation list',
  'Todos los estados': 'All statuses',
  'Buscar solicitudes': 'Search requests',
  'Buscar cliente, producto o WhatsApp…': 'Search customer, product or WhatsApp…',
  'Sin acciones pendientes': 'No pending actions',
  'No hay reservas pendientes': 'No pending reservations',
  'Las solicitudes aparecerán aquí cuando un cliente reserve.': 'Requests will appear here when a customer reserves.',
  'Solicitudes de cotización': 'Quote requests',
  'Ver producto en la tienda': 'View product in store',
  'Cerrar solicitud': 'Close request',
  'Buscar productos': 'Search products',
  'Buscar producto, marca o categoría…': 'Search product, brand or category…',
  'Categoría': 'Category',
  'Precio': 'Price',
  'Visibilidad': 'Visibility',
  'Visible': 'Visible',
  'Mostrar': 'Show',
  'Guardar cambios': 'Save changes',
  'Precio de referencia': 'Reference price',
  'Añade los detalles que verán tus compradores.': 'Add the details your customers will see.',
  'Nombre y modelo': 'Name and model',
  'Marca del producto': 'Product brand',
  'Tu tienda': 'Your store',
  'Panel de administración': 'Administration panel',
  'Sesión iniciada': 'Signed in',
  'Tu tienda, en orden.': 'Your store, organized.',

}
// Keep each node's Spanish source so shared English translations restore precisely.
const textSources = new WeakMap<Text, { source: string; rendered: string }>()
const attributeSources = new WeakMap<HTMLElement, Map<string, { source: string; rendered: string }>>()
function translatedText(source: string, language: Language) {
  if (language === 'es') return source
  const clean = source.trim()
  if (englishText[clean]) return source.replace(clean, englishText[clean])
  return source
    .replace(/· Precios en/g, '· Prices in')
    .replace(/soles/g, 'soles')
    .replace(/dólares/g, 'dollars')
    .replace(/Adelanto del/g, 'Deposit of')
    .replace(/Reserva con el (\d+)%/g, 'Reserve with $1%')
    .replace(/(\d+) productos\b/g, '$1 products')
    .replace(/(\d+) producto\b/g, '$1 product')
    .replace(/Envíanos el enlace de la tienda y solicita una cotización en/g, 'Send us the store link and request a quote in')
}
function translatePage(language: Language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const text = node as Text
    if (['SCRIPT', 'STYLE', 'TEXTAREA'].includes(text.parentElement?.tagName || '')) continue
    const current = text.nodeValue || ''
    const previous = textSources.get(text)
    const source = previous && current === previous.rendered ? previous.source : current
    const rendered = translatedText(source, language)
    if (current !== rendered) text.nodeValue = rendered
    textSources.set(text, { source, rendered })
  }
  document.querySelectorAll<HTMLElement>('[placeholder],[title],[aria-label]').forEach(element => {
    const records = attributeSources.get(element) || new Map()
    for (const attribute of ['placeholder', 'title', 'aria-label']) {
      const current = element.getAttribute(attribute)
      if (!current) continue
      const previous = records.get(attribute)
      const source = previous && current === previous.rendered ? previous.source : current
      const rendered = translatedText(source, language)
      if (current !== rendered) element.setAttribute(attribute, rendered)
      records.set(attribute, { source, rendered })
    }
    attributeSources.set(element, records)
  })
}

let translationTimer: number | undefined

const LanguageContext = createContext<{
  language: Language
  setLanguage: (language: Language) => void
  t: typeof translations.es
}>({ language: 'es', setLanguage: () => undefined, t: translations.es })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')
  const changeLanguage = (next: Language) => {
    setLanguage(next)
  }
  useEffect(() => {
    document.documentElement.lang = language
    const timer = window.setTimeout(() => translatePage(language), 0)
    const observer = new MutationObserver(() => {
      window.clearTimeout(translationTimer)
      translationTimer = window.setTimeout(() => translatePage(language), 120)
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => { window.clearTimeout(timer); window.clearTimeout(translationTimer); observer.disconnect() }
  }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: translations[language] }}>{children}</LanguageContext.Provider>
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useContext(LanguageContext)
  return <label className="language-switcher" title={t.language}><Languages size={15} aria-hidden="true"/><select value={language} onChange={e => setLanguage(e.target.value as Language)} aria-label={t.language}><option value="es">{t.spanish}</option><option value="en">{t.english}</option></select></label>
}

export function useLanguage() { return useContext(LanguageContext) }
