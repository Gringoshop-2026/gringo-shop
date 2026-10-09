export function createCatalogLoader<T>(fetchCatalog: () => Promise<T>, ttl = 30_000) {
  let pending: Promise<T> | undefined
  let cached: { value: T; expires: number } | undefined
  let revision = 0
  return {
    load(): Promise<T> {
      if (cached && cached.expires > Date.now()) return Promise.resolve(cached.value)
      if (pending) return pending
      const startedAtRevision = revision
      const request = fetchCatalog().then(value => {
        if (revision === startedAtRevision) cached = { value, expires: Date.now() + ttl }
        return value
      }).finally(() => { if (pending === request) pending = undefined })
      pending = request
      return request
    },
    invalidate() { revision++; cached = undefined; pending = undefined },
  }
}
