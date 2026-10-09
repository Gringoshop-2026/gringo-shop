// Version the cache when the cutout model or output settings change.
const CACHE_VERSION = 'cutout-v1'
let database: Promise<IDBDatabase | null> | undefined
function openDatabase() {
  return database ??= new Promise(resolve => {
    try {
      const request = indexedDB.open('negroshop-photo-cache', 1)
      request.onupgradeneeded = () => request.result.createObjectStore('photos', { keyPath: 'key' })
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
      request.onblocked = () => resolve(null)
    } catch { resolve(null) }
  })
}
async function keyFor(image: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(image))
  return `${CACHE_VERSION}:${Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')}`
}
const memory = new Map<string, Promise<string>>()
async function read(key: string): Promise<string | undefined> {
  const db = await openDatabase()
  if (!db) return
  return new Promise(resolve => {
    try {
      const request = db.transaction('photos').objectStore('photos').get(key)
      request.onsuccess = () => resolve(request.result?.image)
      request.onerror = () => resolve(undefined)
    } catch { resolve(undefined) }
  })
}
async function write(key: string, image: string) {
  const db = await openDatabase()
  if (!db) return
  await new Promise<void>(resolve => {
    try {
      const tx = db.transaction('photos', 'readwrite')
      const store = tx.objectStore('photos')
      store.put({ key, image, usedAt: Date.now() })
      const request = store.getAll()
      request.onsuccess = () => {
        const rows = request.result.sort((a, b) => b.usedAt - a.usedAt)
        for (const row of rows.slice(60)) store.delete(row.key)
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
      tx.onabort = () => resolve()
    } catch { resolve() }
  })
}
export async function cachedPhoto(image: string, process: (image: string) => Promise<string>): Promise<string> {
  const key = await keyFor(image)
  const existing = memory.get(key)
  if (existing) return existing
  const task = (async () => {
    const saved = await read(key)
    if (saved) return saved
    const result = await process(image)
    await write(key, result)
    // Recognize the saved cutout too, including after a page reload.
    const resultKey = await keyFor(result)
    memory.set(resultKey, Promise.resolve(result))
    if (memory.size > 12) memory.delete(memory.keys().next().value!)
    await write(resultKey, result)
    return result
  })()
  memory.set(key, task)
  if (memory.size > 12) memory.delete(memory.keys().next().value!)
  try { return await task } catch (error) { memory.delete(key); throw error }
}
