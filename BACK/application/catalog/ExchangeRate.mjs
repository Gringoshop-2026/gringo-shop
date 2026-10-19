export function exchangeRate(sqlite, fetcher=fetch, now=()=>Date.now()) {
 let pending, retryAfter=0
 const key='exchange-usd-pen'
 const load=()=>{try{return JSON.parse(sqlite.prepare('SELECT value FROM settings WHERE key=?').get(key)?.value||'null')}catch{return null}}
 const valid=value=>value&&Number.isFinite(value.rate)&&value.rate>0&&value.rate<100&&/^\d{4}-\d{2}-\d{2}$/.test(value.date)&&Number.isFinite(value.checkedAt)
 return async function read() {
  const cached=load()
  const available=valid(cached)&&now()-Date.parse(cached.date+'T00:00:00Z')<7*86400000
  if(available&&now()-cached.checkedAt<3600000)return {...cached,stale:false}
  if(now()<retryAfter){if(available)return {...cached,stale:true};throw new Error('Tipo de cambio no disponible.')}
  if(pending)return pending
  pending=(async()=>{
   try {
    const response=await fetcher('https://api.frankfurter.dev/v2/rate/USD/PEN',{signal:AbortSignal.timeout(8000)})
    if(!response.ok)throw Error('Provider unavailable')
    const input=await response.json();const rate={rate:input.rate,date:input.date,checkedAt:now(),source:'Frankfurter',base:'USD',quote:'PEN'}
    if(input.base!=='USD'||input.quote!=='PEN'||!valid(rate)||Date.parse(rate.date+'T00:00:00Z')>now()+86400000||now()-Date.parse(rate.date+'T00:00:00Z')>=7*86400000)throw Error('Invalid rate')
    sqlite.prepare('INSERT OR REPLACE INTO settings(key,value) VALUES (?,?)').run(key,JSON.stringify(rate))
    return {...rate,stale:false}
   }catch{retryAfter=now()+60000;if(available)return {...cached,stale:true};throw new Error('No pudimos actualizar el tipo de cambio. Los precios siguen disponibles en su moneda original.')}
   finally{pending=undefined}
  })()
  return pending
 }
}
