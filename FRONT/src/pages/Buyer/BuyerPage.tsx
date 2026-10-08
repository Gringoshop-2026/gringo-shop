import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, Heart, MessageCircle, Package, Search, ShoppingBag, X } from 'lucide-react'
import { createOrder, createQuote, getCategories, getProducts, getSettings } from '../../services/api'
import ProductDetail from '../../components/ProductDetail'
import BuyerOrderHistory from '../../components/BuyerOrderHistory'
import Dialog from '../../components/Dialog'
import InstallmentNotice from '../../components/InstallmentNotice'
import { LanguageSwitcher } from '../../i18n'

export type Product = { id: string; name: string; brand: string; category: string; price: number; referencePrice: number; reservationPercent: number; art: string; tag: string; currencySymbol?: string; image?: string; images?: string[]; active?: boolean }
export const money = (value: number) => value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const initialSettings = { reservationPercent: 50, whatsapp: '', currency: 'PEN', welcomeMessage: 'Compra directo de tiendas de Estados Unidos.' }

function Card({ product: p, onReserve, onView }: { product: Product; onReserve: (p: Product) => void; onView: (p: Product) => void }) {
  const [favorite, setFavorite] = useState(false)
  return <article className="catalog-card">
    <div className="card-media">
      {p.tag && <span className="product-tag">{p.tag}</span>}
      <button type="button" className="favorite-button" aria-label={`${favorite ? 'Quitar de' : 'Añadir a'} favoritos: ${p.name}`} aria-pressed={favorite} onClick={() => setFavorite(!favorite)}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></button>
      <button className="product-photo" onClick={() => onView(p)} aria-label={`Ver detalles de ${p.name}`}>
        {p.image ? <img src={p.image} alt={p.name} loading="lazy" decoding="async" /> : <div className="missing-photo"><Package size={48} strokeWidth={1} /><span>Imagen no disponible</span></div>}
      </button>
    </div>
    <div className="card-content"><p className="product-brand">{p.brand}</p><h3><button onClick={() => onView(p)}>{p.name}</button></h3>
      <div className="product-price"><span>Precio NegroShop</span><strong>{p.currencySymbol} {money(p.price)}</strong><p>Adelanto del {p.reservationPercent}% <b>{p.currencySymbol} {money(p.price * p.reservationPercent / 100)}</b></p></div>
      <button className="primary-button reserve-button" onClick={() => onReserve(p)}><ShoppingBag size={17} /> Reservar producto <ArrowRight size={16} /></button>
    </div>
  </article>
}

export default function BuyerPage() {
  const [catalog, setCatalog] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState('Todos')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState<'order' | 'quote' | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [detail, setDetail] = useState<Product | null>(null)
  const [message, setMessage] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')
  const [formError, setFormError] = useState('')
  const [sending, setSending] = useState(false)
  const [settings, setSettings] = useState(initialSettings)
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let cancelled = false
    let busy = false
    const load = async (initial = false) => {
      if (busy) return
      busy = true
      try {
        const [items, categories, next] = await Promise.all([getProducts(), getCategories(), getSettings()])
        if (cancelled) return
        setSettings(next)
        setCategoryOptions(categories)
        setCatalog(items.filter((p: Product) => p.active !== false).map((p: Product) => ({ ...p, reservationPercent: next.reservationPercent, currencySymbol: next.currency === 'USD' ? '$' : 'S/' })))
        setError('')
      } catch {
        if (!cancelled) setError('No pudimos actualizar el catálogo. Intenta nuevamente en unos momentos.')
      } finally {
        busy = false
        if (initial && !cancelled) setLoading(false)
      }
    }
    setLoading(true)
    void load(true)
    const timer = window.setInterval(() => { if (!document.hidden) void load() }, 5000)
    return () => { cancelled = true; window.clearInterval(timer) }
  }, [reload])

  const categories = ['Todos', ...categoryOptions]
  const filtered = useMemo(() => catalog.filter(p => (active === 'Todos' || p.category === active) && [p.name, p.brand, p.category].some(value => value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))), [catalog, active, query])
  const openQuote = () => { setFormError(''); setModal('quote') }
  const reserve = (p: Product) => { setSelected(p); setFormError(''); setModal('order') }
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    const form = new FormData(event.currentTarget)
    const customer = String(form.get('customer')).trim()
    const phone = String(form.get('phone')).trim()
    setSending(true); setFormError('')
    try {
      if (modal === 'order' && selected) {
        await createOrder({ productId: selected.id, productName: selected.name, customer, phone })
        setMessage('Recibimos tu solicitud de reserva. Consulta su estado en «Mis reservas».')
        const number = settings.whatsapp.replace(/\D/g, '')
        if (number) {
          const text = `Hola, quiero coordinar mi reserva en NegroShop. Producto: ${selected.name}. Precio: ${selected.currencySymbol} ${money(selected.price)}. Adelanto: ${selected.currencySymbol} ${money(selected.price * selected.reservationPercent / 100)}. Cliente: ${customer}. WhatsApp: ${phone}.`
          setWhatsappLink(`https://wa.me/51${number}?text=${encodeURIComponent(text)}`)
        }
      } else {
        await createQuote({ customer, phone, name: String(form.get('name')).trim(), link: String(form.get('link')).trim(), notes: String(form.get('notes')).trim() })
        setWhatsappLink('')
        setMessage('Recibimos tu solicitud de cotización. Te contactaremos por WhatsApp.')
      }
      setModal(null)
    } catch (failure) {
      setFormError(failure instanceof Error ? `${failure.message}. Revisa tus datos e intenta nuevamente.` : 'No pudimos enviar la solicitud. Intenta nuevamente.')
    } finally { setSending(false) }
  }
  return <div className="storefront">
    <a className="skip-link" href="#catalogo">Ir al catálogo</a>
    <div className="announcement">De Estados Unidos a tus manos <span>· Precios en {settings.currency === 'USD' ? 'dólares' : 'soles'}</span></div>
    <header className="store-header"><div className="store-header-inner">
      <a href="/" className="wordmark" aria-label="NegroShop, inicio"><ShoppingBag size={23} strokeWidth={1.8} /><b>NEGRO<span>SHOP</span></b></a>
      <nav aria-label="Navegación principal"><a href="#catalogo">Catálogo</a><a href="#como">Cómo funciona</a><a href="#mis-reservas">Mis reservas</a></nav>
      <div className="header-actions"><button className="quote-button" onClick={openQuote}><MessageCircle size={16} /><span>Cotizar</span></button><LanguageSwitcher /></div>
    </div></header>
    <main className="store-main">
      {message && <div role="status" className="success-message">{message}{whatsappLink && <a className="text-button" href={whatsappLink} target="_blank" rel="noreferrer">Coordinar por WhatsApp</a>}<button aria-label="Cerrar mensaje" onClick={() => setMessage('')}><X size={18} /></button></div>}
      <section className="store-hero"><div className="hero-copy"><h1>Tus marcas favoritas.<br /><span>Más cerca de ti.</span></h1><p>{settings.welcomeMessage}</p><div className="hero-actions"><a className="primary-button" href="#catalogo">Explorar catálogo <ArrowRight size={18} /></a><button className="text-button" onClick={openQuote}>Cotizar un producto <ArrowRight size={16} /></button></div></div><div className="hero-reservation"><ShoppingBag size={30} strokeWidth={1.3} /><p>Elige. Reserva. Recibe.</p><strong>{settings.reservationPercent}<span>%</span></strong><p>de adelanto para reservar.<br />El saldo, al recibir tu producto.</p><a href="#como">Así funciona <ArrowRight size={16} /></a></div></section>
      <InstallmentNotice whatsapp={settings.whatsapp} />
      <section id="catalogo" className="catalog-section" aria-labelledby="catalog-title"><div className="catalog-heading"><div><h2 id="catalog-title">Encuentra tu próximo favorito</h2><p>Explora nuestras marcas y productos.</p></div><label className="catalog-search"><Search size={18} /><span className="sr-only">Buscar en el catálogo</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar producto, marca…" /></label></div>
        <div className="catalog-toolbar"><div className="category-list" aria-label="Filtrar por categoría">{categories.map(category => <button key={category} aria-pressed={active === category} className={active === category ? 'active' : ''} onClick={() => setActive(category)}>{category}</button>)}</div><span className="catalog-count" role="status">{loading ? 'Cargando catálogo…' : `${filtered.length} ${filtered.length === 1 ? 'producto' : 'productos'}`}</span></div>
        {error && <div role="alert" className="error-message"><p>{error}</p><button onClick={() => setReload(value => value + 1)}>Reintentar</button></div>}
        <div className="catalog-grid" aria-busy={loading}>{loading ? [1, 2, 3].map(i => <div key={i} className="catalog-skeleton" />) : filtered.map(p => <Card key={p.id} product={p} onView={setDetail} onReserve={reserve} />)}</div>
        {!loading && !error && filtered.length === 0 && <div className="empty-catalog"><Search size={28} /><h3>{catalog.length ? 'No encontramos coincidencias' : 'Pronto habrá nuevos productos'}</h3><p>{catalog.length ? 'Prueba con otra marca o categoría.' : 'Mientras tanto, envíanos el enlace del producto que buscas.'}</p>{catalog.length > 0 && <button className="text-button" onClick={() => { setQuery(''); setActive('Todos') }}>Ver todos los productos <ArrowRight size={16} /></button>}</div>}
        <div className="quote-banner"><div><h2>¿Buscas algo más?</h2><p>Envíanos el enlace de la tienda y solicita una cotización en {settings.currency === 'USD' ? 'dólares' : 'soles'}.</p></div><button className="primary-button" onClick={openQuote}>Solicitar cotización <ArrowRight size={17} /></button></div>
      </section>
      <section id="como" className="how-section"><h2>De la tienda a tus manos</h2><div className="how-steps">{[['1', 'Elige tu producto', 'Encuéntralo en el catálogo o envíanos el enlace de la tienda.'], ['2', `Reserva con el ${settings.reservationPercent}%`, 'Adelanta el porcentaje indicado en tu cotización para reservar.'], ['3', 'Recibe y paga el saldo', 'Paga el monto restante al recibir tu producto.']].map(([number, title, description]) => <div className="how-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
      <BuyerOrderHistory />
    </main>
    <footer className="store-footer"><a className="wordmark" href="/">NEGRO<span>SHOP</span></a><p>Compra directo de tiendas de Estados Unidos.</p><a href="#catalogo">Volver al catálogo <ArrowRight size={15} /></a></footer>
    {detail && <ProductDetail product={detail} whatsapp={settings.whatsapp} onClose={() => setDetail(null)} onReserve={() => { reserve(detail); setDetail(null) }} />}
    {modal && <Dialog label={modal === 'order' ? 'Crear reserva' : 'Solicitar cotización'} onClose={() => { if (!sending) setModal(null) }}><form onSubmit={submit} className="request-form"><div className="dialog-heading"><h2>{modal === 'order' ? 'Reserva tu producto' : '¿Qué te gustaría traer?'}</h2><button type="button" disabled={sending} onClick={() => setModal(null)} aria-label="Cerrar formulario"><X size={22} /></button></div><p className="form-description">{modal === 'order' ? selected?.name : 'Comparte los detalles y te contactaremos por WhatsApp.'}</p>
      {modal === 'order' && selected && <div className="reservation-summary"><span>Adelanto del {selected.reservationPercent}%</span><strong>{selected.currencySymbol} {money(selected.price * selected.reservationPercent / 100)}</strong></div>}
      <label>Tu nombre<input name="customer" required autoComplete="name" maxLength={120} placeholder="Nombre y apellido" /></label>
      <label>Tu WhatsApp<input name="phone" type="tel" required autoComplete="tel-national" inputMode="numeric" maxLength={9} pattern="9[0-9]{8}" placeholder="9XXXXXXXX" /><small>Usa un número peruano de 9 dígitos que comience con 9.</small></label>
      {modal === 'quote' && <><label>Producto<input name="name" required maxLength={200} placeholder="Nombre o modelo del producto" /></label><label>Enlace de la tienda <span>(opcional)</span><input name="link" type="url" placeholder="https://" /></label><label>Detalles <span>(opcional)</span><textarea name="notes" maxLength={2000} placeholder="Talla, color, cantidad…" /></label></>}
      {formError && <p role="alert" className="error-message">{formError}</p>}<button className="primary-button" disabled={sending}>{sending ? 'Enviando solicitud…' : modal === 'order' ? 'Solicitar reserva' : 'Enviar solicitud'}<ArrowRight size={17} /></button>
    </form></Dialog>}
  </div>
}
