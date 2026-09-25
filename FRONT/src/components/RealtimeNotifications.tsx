import { useEffect, useRef, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { getOrders, getQuotes } from '../services/api'

export default function RealtimeNotifications() {
  const initialized = useRef(false)
  const snapshot = useRef({ orders: 0, quotes: 0 })
  const [pending, setPending] = useState({ orders: 0, quotes: 0 })
  const [notice, setNotice] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const toggleNotifications = () => {
    setOpen(value => {
      const next = !value
      if (next) setNotice('')
      return next
    })
  }
  const activeItems = items.filter(item => item.status === 'reserved' || item.status === 'pending')
  const pendingCount = activeItems.length
  const attendNotification = (item: any) => {
    setOpen(false)
    const section = document.getElementById(item.kind === 'Cotización' ? 'cotizaciones' : 'reservas')
    const matches = Array.from(section?.querySelectorAll('*') || []).filter(element => element.textContent?.trim() === item.title.trim())
    const textTarget = (matches[0] || Array.from(section?.querySelectorAll('*') || []).filter(element => element.textContent?.includes(item.title)).sort((a, b) => (a.textContent?.length || 0) - (b.textContent?.length || 0))[0]) as HTMLElement | undefined
    const target = (item.kind === 'Reserva' ? textTarget?.closest('tr') : textTarget?.closest('.rounded-lg')) as HTMLElement | undefined
    ;(target || section)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (target) {
      target.classList.remove('notification-target-highlight')
      void target.offsetWidth
      target.classList.add('notification-target-highlight')
      window.setTimeout(() => target.classList.remove('notification-target-highlight'), 2100)
    }
  }
  useEffect(() => {
    const check = async () => {
      try {
        const [orders, quotes] = await Promise.all([getOrders(), getQuotes()])
        const next = { orders: orders.filter((item: any) => item.status === 'reserved').length, quotes: quotes.filter((item: any) => item.status === 'pending').length }
        setPending(next)
        setItems([...orders.map((item: any) => ({ ...item, kind: 'Reserva', title: item.productName })), ...quotes.map((item: any) => ({ ...item, kind: 'Cotización', title: item.name }))].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3))
        if (initialized.current && next.orders > snapshot.current.orders) setNotice('Nueva reserva recibida.')
        else if (initialized.current && next.quotes > snapshot.current.quotes) setNotice('Nueva cotización recibida.')
        snapshot.current = next
        initialized.current = true
      } catch {}
    }
    check()
    const timer = window.setInterval(check, 1000)
    window.addEventListener('focus', check)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', check)
    }
  }, [])
  return <><button onClick={toggleNotifications} className="admin-notification-counter fixed right-5 top-5 z-[70] flex items-center gap-2 rounded-full border border-[#e5e0d7] bg-[#fbf9f4] px-3 py-2 text-sm font-bold text-[#1c2b39] shadow-lg" aria-label="Ver notificaciones"><Bell size={17} className="text-[#a9553f]"/><span className="rounded-full bg-[#a9553f] px-2 py-0.5 text-xs text-white">{pendingCount}</span></button>{open&&<div className="admin-notification-panel fixed right-5 top-16 z-[70] w-[min(340px,calc(100vw-32px))] rounded-2xl border border-[#e5e0d7] bg-white p-4 text-[#1c2b39] shadow-2xl"><div className="flex items-center justify-between"><h3 className="font-bold">Notificaciones</h3><button onClick={() => setOpen(false)} aria-label="Cerrar"><X size={16}/></button></div><div className="mt-3 space-y-2">{activeItems.length ? activeItems.map(item => <button type="button" onClick={() => attendNotification(item)} key={item.id} className="block w-full rounded-xl bg-[#f5f2ec] p-3 text-left transition hover:bg-[#eee8de]"><p className="text-xs font-bold uppercase tracking-wide text-[#a9553f]">{item.kind}</p><p className="mt-1 text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-[#68717a]">Pendiente · Clic para atender</p></button>) : <p className="py-4 text-center text-sm text-[#68717a]">No hay notificaciones pendientes.</p>}</div></div>}{notice&&<div className="admin-notification-toast fixed right-5 top-16 z-[70] rounded-xl bg-[#1c2b39] px-4 py-3 text-sm font-bold text-white shadow-2xl">{notice}</div>}</>
}
