import { shopWhatsappUrl } from '../../utils/whatsapp'
import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Heart, MessageCircle, Package, Search, ShoppingBag } from 'lucide-react'
import { getCategories, getProducts, getSettings } from '../../services/api'
import ProductDetail from '../../components/ProductDetail'
import InstallmentNotice from '../../components/InstallmentNotice'
import { LanguageSwitcher } from '../../i18n'

export type Product = { id: string; name: string; brand: string; category: string; price: number; referencePrice: number; art: string; tag: string; currencySymbol?: string; image?: string; images?: string[]; active?: boolean }
export const money = (value: number) => value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const initialSettings = { whatsapp: '', currency: 'PEN', welcomeMessage: 'Compra directo de tiendas de Estados Unidos.' }

function Card({ product: p, reserveHref, onView }: { product: Product; reserveHref?: string; onView: (p: Product) => void }) {
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
      <div className="product-price"><span>Precio NegroShop</span><strong>{p.currencySymbol} {money(p.price)}</strong></div>
      <a className="primary-button reserve-button" href={reserveHref} target="_blank" rel="noreferrer" aria-disabled={!reserveHref}><MessageCircle size={17} /> Reservar por WhatsApp <ArrowRight size={16} /></a>
    </div>
  </article>
}

export default function BuyerPage() {
  const [catalog, setCatalog] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState('Todos')
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState<Product | null>(null)
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
        setCatalog(items.filter((p: Product) => p.active !== false).map((p: Product) => ({ ...p, currencySymbol: next.currency === 'USD' ? '$' : 'S/' })))
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
  const quoteHref = shopWhatsappUrl(settings.whatsapp, 'Hola, quiero cotizar un producto en NegroShop. Te comparto el enlace y los detalles por aquí.')
  const reserveHref = (product: Product) => shopWhatsappUrl(settings.whatsapp, `Hola, quiero reservar este producto en NegroShop: ${product.name}. Precio: ${product.currencySymbol} ${money(product.price)}. ¿Me ayudan con la compra?`)
  return <div className="storefront">
    <a className="skip-link" href="#catalogo">Ir al catálogo</a>
    <div className="announcement">De Estados Unidos a tus manos <span>· Precios en {settings.currency === 'USD' ? 'dólares' : 'soles'}</span></div>
    <header className="store-header"><div className="store-header-inner">
      <a href="/" className="wordmark" aria-label="NegroShop, inicio"><ShoppingBag size={23} strokeWidth={1.8} /><b>NEGRO<span>SHOP</span></b></a>
      <nav aria-label="Navegación principal"><a href="#catalogo">Catálogo</a><a href="#como">Cómo funciona</a><a href="#contacto">Contacto</a></nav>
      <div className="header-actions"><a className="quote-button" href={quoteHref} target="_blank" rel="noreferrer"><MessageCircle size={16} /><span>Cotizar</span></a><LanguageSwitcher /></div>
    </div></header>
    <main className="store-main">
      <section className="store-hero"><div className="hero-copy"><h1>Tus marcas favoritas.<br /><span>Más cerca de ti.</span></h1><p>{settings.welcomeMessage}</p><div className="hero-actions"><a className="primary-button" href="#catalogo">Explorar catálogo <ArrowRight size={18} /></a><a className="text-button" href={quoteHref} target="_blank" rel="noreferrer">Cotizar por WhatsApp <ArrowRight size={16} /></a></div></div><div className="hero-reservation"><ShoppingBag size={30} strokeWidth={1.3} /><p>Elige. Reserva. Recibe.</p><h2>Tu próxima compra,<br />más cerca.</h2><p>Reserva tu producto y coordina<br />los detalles por WhatsApp.</p><a href="#como">Así funciona <ArrowRight size={16} /></a></div></section>
      <InstallmentNotice whatsapp={settings.whatsapp} />
      <section id="catalogo" className="catalog-section" aria-labelledby="catalog-title"><div className="catalog-heading"><div><h2 id="catalog-title">Encuentra tu próximo favorito</h2><p>Explora nuestras marcas y productos.</p></div><label className="catalog-search"><Search size={18} /><span className="sr-only">Buscar en el catálogo</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar producto, marca…" /></label></div>
        <div className="catalog-toolbar"><div className="category-list" aria-label="Filtrar por categoría">{categories.map(category => <button key={category} aria-pressed={active === category} className={active === category ? 'active' : ''} onClick={() => setActive(category)}>{category}</button>)}</div><span className="catalog-count" role="status">{loading ? 'Cargando catálogo…' : `${filtered.length} ${filtered.length === 1 ? 'producto' : 'productos'}`}</span></div>
        {error && <div role="alert" className="error-message"><p>{error}</p><button onClick={() => setReload(value => value + 1)}>Reintentar</button></div>}
        <div className="catalog-grid" aria-busy={loading}>{loading ? [1, 2, 3].map(i => <div key={i} className="catalog-skeleton" />) : filtered.map(p => <Card key={p.id} product={p} onView={setDetail} reserveHref={reserveHref(p)} />)}</div>
        {!loading && !error && filtered.length === 0 && <div className="empty-catalog"><Search size={28} /><h3>{catalog.length ? 'No encontramos coincidencias' : 'Pronto habrá nuevos productos'}</h3><p>{catalog.length ? 'Prueba con otra marca o categoría.' : 'Mientras tanto, envíanos el enlace del producto que buscas.'}</p>{catalog.length > 0 && <button className="text-button" onClick={() => { setQuery(''); setActive('Todos') }}>Ver todos los productos <ArrowRight size={16} /></button>}</div>}
        <div className="quote-banner"><div><h2>¿Buscas algo más?</h2><p>Envíanos el enlace de la tienda y solicita una cotización en {settings.currency === 'USD' ? 'dólares' : 'soles'}.</p></div><a className="primary-button" href={quoteHref} target="_blank" rel="noreferrer">Cotizar por WhatsApp <ArrowRight size={17} /></a></div>
      </section>
      <section id="como" className="how-section"><h2>De la tienda a tus manos</h2><div className="how-steps">{[['1', 'Elige tu producto', 'Encuéntralo en el catálogo o envíanos el enlace de la tienda.'], ['2', 'Coordina tu reserva', 'Escríbenos por WhatsApp y coordinamos tu compra.'], ['3', 'Recibe tu producto', 'Te acompañamos hasta la entrega de tu compra.']].map(([number, title, description]) => <div className="how-step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div></section>
      <section id="contacto" className="quote-banner"><div><h2>Hablemos por WhatsApp</h2><p>Consulta por un producto, tu compra o las opciones de pago.</p></div>{quoteHref?<a className="primary-button" href={shopWhatsappUrl(settings.whatsapp,'Hola, tengo una consulta sobre NegroShop.')} target="_blank" rel="noreferrer"><MessageCircle size={17}/>Escribir por WhatsApp</a>:<p role="status">El contacto por WhatsApp estará disponible pronto.</p>}</section>
    </main>
    <footer className="store-footer"><a className="wordmark" href="/">NEGRO<span>SHOP</span></a><p>Compra directo de tiendas de Estados Unidos.</p><a href="#catalogo">Volver al catálogo <ArrowRight size={15} /></a></footer>
    {detail && <ProductDetail product={detail} whatsapp={settings.whatsapp} onClose={() => setDetail(null)} reserveHref={reserveHref(detail)} />}
  </div>
}
