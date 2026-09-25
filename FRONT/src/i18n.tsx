import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Language = 'es' | 'en'

const translations = {
  es: { language: 'Idioma', spanish: 'Español', english: 'English' },
  en: { language: 'Language', spanish: 'Spanish', english: 'English' },
} as const

const englishText: Record<string, string> = {
  'Catálogo': 'Catalog', 'Cómo funciona': 'How it works', 'Mis reservas': 'My reservations',
  'Cotizar': 'Get a quote', 'Buscar producto': 'Search product', 'Control general': 'Dashboard',
  'Publicar producto': 'Publish product', 'Gestionar reservas': 'Manage reservations',
  'Cliente': 'Customer', 'Producto': 'Product', 'WhatsApp': 'WhatsApp', 'Estado': 'Status',
  'Acciones': 'Actions', 'Pendiente': 'Pending', 'Confirmada': 'Confirmed', 'Cancelada': 'Cancelled',
  'Completada': 'Completed', 'Confirmar': 'Confirm', 'Cancelar': 'Cancel', 'Productos': 'Products',
  'Reservas': 'Reservations', 'Cotizaciones': 'Quotes', 'Pendientes': 'Pending', 'Enviar': 'Send',
  'Crear reserva': 'Create reservation', 'Solicitar cotización': 'Request a quote',
  'Nombre del producto': 'Product name', 'Marca': 'Brand', 'Precio Gringo': 'Gringo price',
  'Precio de tienda': 'Store price', 'Selecciona una categoría': 'Select a category',
  'Foto del producto': 'Product photo', 'Configuración': 'Settings', 'Guardar configuración': 'Save settings',
  'Modo administrador': 'Administrator mode', 'Todavía no hay cotizaciones.': 'There are no quotes yet.',
  '¿Cómo funciona GringoShop?': 'How does GringoShop work?', 'Transparencia total': 'Total transparency',
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
  'Activo': 'Active', 'Oculto': 'Hidden', 'Disponible': 'Available', 'Reactivar': 'Reactivate',
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
  'Pedidos & reservas': 'Orders & reservations', 'Salir': 'Log out', 'Confirmada': 'Confirmed',
  'Cancelada': 'Cancelled', 'Contactar': 'Contact', 'Cerrar': 'Close', 'Editar': 'Edit',
  'Ocultar': 'Hide', 'Activo': 'Active', '7 productos disponibles': '7 products available',
  'Todos': 'All', 'Accesorios': 'Accessories', 'Perfumes': 'Perfumes', 'Sneakers & Calzado': 'Sneakers & Footwear',
  'Tecnología': 'Technology', 'Seguimiento': 'Tracking', 'Consulta tus reservas': 'Check your reservations',
  'Precio directo de tienda oficial.': 'Direct official store price.', 'Cotizar un producto': 'Request a quote',
}

const spanishText = Object.fromEntries(Object.entries(englishText).map(([es, en]) => [en, es])) as Record<string, string>
const originalText = new WeakMap<Text, string>()

function translatePage(language: Language) {
  const dictionary = language === 'en' ? englishText : spanishText
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let node: Node | null
  while ((node = walker.nextNode())) {
    const text = node as Text
    if (!originalText.has(text)) originalText.set(text, text.nodeValue || '')
    const current = text.nodeValue || ''
    const clean = current.trim()
    if (!clean) continue
    const translated = dictionary[clean] || (language === 'en' ? englishText[originalText.get(text)?.trim() || ''] : spanishText[clean])
    if (translated) text.nodeValue = current.replace(clean, translated)
    else if (language === 'en') text.nodeValue = current.replace(/Reserva con solo (\d+)% de adelanto\./g, 'Reserve with only $1% upfront.').replace(/Reserva (\d+)%:/g, 'Reserve $1%:').replace(/(\d+) productos disponibles/g, '$1 products available')
    else text.nodeValue = current.replace(/Reserve with only (\d+)% upfront\./g, 'Reserva con solo $1% de adelanto.').replace(/Reserve (\d+)%:/g, 'Reserva $1%:').replace(/(\d+) products available/g, '$1 productos disponibles')
  }
  document.querySelectorAll<HTMLElement>('[placeholder],[title],[aria-label]').forEach(element => {
    for (const attribute of ['placeholder', 'title', 'aria-label']) {
      const value = element.getAttribute(attribute)
      if (value && dictionary[value]) element.setAttribute(attribute, dictionary[value])
    }
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
    return () => { window.clearTimeout(timer); observer.disconnect() }
  }, [language])
  return <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: translations[language] }}>{children}</LanguageContext.Provider>
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useContext(LanguageContext)
  return <label className="language-switcher" title={t.language}><span>✦</span><select value={language} onChange={e => setLanguage(e.target.value as Language)} aria-label={t.language}><option value="es">{t.spanish}</option><option value="en">{t.english}</option></select></label>
}

export function useLanguage() { return useContext(LanguageContext) }
