import test from 'node:test'
import assert from 'node:assert/strict'
import {vercelStats} from '../application/analytics/VercelStats.mjs'
test('Vercel totals use unique visitors, protect credentials and cache requests',async()=>{
 let calls=0
 const read=vercelStats({token:'private-test-token',projectId:'project',teamId:'team',fetcher:async(url,options)=>{
  calls++;assert.equal(options.headers.authorization,'Bearer private-test-token');assert.ok(!url.includes('private-test-token'));assert.ok(url.includes('projectId=project'))
  return {ok:true,json:async()=>({data:url.includes('/count?')?{visitors:3,pageviews:9}:[{timestamp:'2026-10-15T00:00:00Z',visitors:3,pageviews:9}]})}
 }})
 assert.deepEqual(await read(),{source:'vercel',days:7,visitors:3,views:9,firstDay:null,daily:[{day:'2026-10-15',visitors:3,views:9}]})
 await read();assert.equal(calls,2)
})
test('Vercel rejects failed requests without exposing response or token',async()=>{
 const read=vercelStats({token:'secret',projectId:'project',teamId:'team',fetcher:async()=>({ok:false,status:403})})
 await assert.rejects(read(),/Revisa el token privado/)
})
