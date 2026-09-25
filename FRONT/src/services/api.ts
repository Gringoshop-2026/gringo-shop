const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
export async function loginAdmin(username:string,password:string){const response=await fetch(`${API_URL}/auth/login`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username,password})});const result=await response.json();if(!response.ok)throw new Error(result.error||'No se pudo iniciar sesión');return result}
export const adminHeaders=()=>{const token=sessionStorage.getItem('gringo-admin-token');return token?{authorization:`Bearer ${token}`}:{}}
async function adminFetch(input:RequestInfo|URL, init?:RequestInit){const response=await fetch(input,init);if(response.status===401){sessionStorage.removeItem('gringo-admin-auth');sessionStorage.removeItem('gringo-admin-token');window.location.href='/admin'}return response}

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`)
  if (!response.ok) throw new Error('No pudimos cargar el catálogo')
  return response.json()
}
export async function getCategories(): Promise<string[]> { const response = await fetch(`${API_URL}/categories`); if (!response.ok) throw new Error('No pudimos cargar las categorías'); return response.json() }
export async function getSettings() { const response = await fetch(`${API_URL}/settings`); if (!response.ok) throw new Error('No pudimos cargar la configuración'); return response.json() }
export async function updateSettings(payload: { reservationPercent: number; whatsapp: string; currency: string; welcomeMessage: string }) { const response = await adminFetch(`${API_URL}/settings`, { method:'PATCH', headers:{'content-type':'application/json',...adminHeaders()}, body:JSON.stringify(payload) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || 'No pudimos guardar la configuración'); return result }

export async function getOrders() { const response = await adminFetch(`${API_URL}/orders`, { headers: adminHeaders() }); if (!response.ok) throw new Error('No pudimos cargar las reservas'); return response.json() }
export async function getOrdersByPhone(phone:string) { const response = await fetch(`${API_URL}/orders?phone=${encodeURIComponent(phone)}`); if (!response.ok) throw new Error('No pudimos consultar tus reservas'); return response.json() }
export async function getCustomers() { const response = await adminFetch(`${API_URL}/customers`, { headers: adminHeaders() }); if (!response.ok) throw new Error('No pudimos cargar los clientes'); return response.json() }
export async function getQuotes() { const response = await adminFetch(`${API_URL}/quotes`, { headers: adminHeaders() }); if (!response.ok) throw new Error('No pudimos cargar las cotizaciones'); return response.json() }
export async function createProduct(payload: { name:string; brand:string; category:string; price:number; referencePrice:number; image?:string }) { const response = await adminFetch(`${API_URL}/products`, { method:'POST', headers:{'content-type':'application/json',...adminHeaders()}, body:JSON.stringify(payload) }); if (!response.ok) throw new Error('No pudimos publicar el producto'); return response.json() }
export async function updateProduct(id:string, payload: { name?:string; brand?:string; category?:string; price?:number; referencePrice?:number; active?:boolean }) { const response = await adminFetch(`${API_URL}/products/${id}`, { method:'PATCH', headers:{'content-type':'application/json',...adminHeaders()}, body:JSON.stringify(payload) }); if (!response.ok) throw new Error('No pudimos actualizar el producto'); return response.json() }
export async function updateOrderStatus(id: string, status: 'confirmed'|'cancelled') { const response = await adminFetch(`${API_URL}/orders/${id}`, { method:'PATCH', headers:{'content-type':'application/json',...adminHeaders()}, body:JSON.stringify({ status }) }); if (!response.ok) throw new Error('No pudimos actualizar la reserva'); return response.json() }
export async function updateQuoteStatus(id: string, status: 'contacted'|'closed') { const response = await adminFetch(`${API_URL}/quotes/${id}`, { method:'PATCH', headers:{'content-type':'application/json',...adminHeaders()}, body:JSON.stringify({ status }) }); if (!response.ok) throw new Error('No pudimos actualizar la cotización'); return response.json() }

export async function createQuote(payload: { customer: string; phone: string; name: string; link?: string; notes?: string }) {
  const response = await fetch(`${API_URL}/quotes`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
  if (!response.ok) throw new Error('No pudimos crear la cotización')
  return response.json()
}

export async function createOrder(payload: { productId?: string; productName: string; customer: string; phone: string }) {
  const phone = payload.phone.replace(/\D/g, '')
  if (!/^9\d{8}$/.test(phone)) {
    window.alert('Número inválido: escribe un WhatsApp peruano de 9 dígitos que comience con 9.')
    throw new Error('El WhatsApp debe tener 9 dígitos y comenzar con 9')
  }
  const response = await fetch(`${API_URL}/orders`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, phone }) })
  if (!response.ok) throw new Error('No pudimos crear la reserva')
  return response.json()
}
