export function vercelStats({token,projectId,teamId,fetcher=fetch}) {
  const cache=new Map()
  return async function read(days=7) {
    const previous=cache.get(days)
    if(previous&&Date.now()-previous.time<60000)return previous.value
    const until=new Date(); const since=new Date(until);since.setUTCDate(since.getUTCDate()-days+1);since.setUTCHours(0,0,0,0)
    const query=new URLSearchParams({projectId,teamId,since:since.toISOString(),until:until.toISOString(),filter:"environment eq 'production' and not startswith(requestPath, '/admin')"})
    async function request(endpoint,extra={}) {
      const params=new URLSearchParams(query);for(const [key,value]of Object.entries(extra))params.set(key,value)
      const response=await fetcher(`https://api.vercel.com/v1/query/web-analytics/visits/${endpoint}?${params}`,{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(12000)})
      if(!response.ok)throw new Error('No pudimos consultar Vercel Analytics. Revisa el token privado del servidor y su acceso al proyecto.')
      return (await response.json()).data
    }
    const [total,rows]=await Promise.all([request('count'),request('aggregate',{by:'day',limit:String(days+1)})])
    if(!total||!Number.isFinite(total.visitors)||!Number.isFinite(total.pageviews)||!Array.isArray(rows))throw new Error('Vercel devolvió estadísticas inválidas.')
    const value={source:'vercel',days,visitors:total.visitors,views:total.pageviews,firstDay:null,daily:rows.map(row=>({day:row.timestamp.slice(0,10),visitors:row.visitors,views:row.pageviews}))}
    cache.set(days,{time:Date.now(),value});return value
  }
}
