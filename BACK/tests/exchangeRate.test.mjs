import test from 'node:test'
import assert from 'node:assert/strict'
import {DatabaseSync} from 'node:sqlite'
import {exchangeRate} from '../application/catalog/ExchangeRate.mjs'
test('rate refresh is shared, cached, persisted and retained only while recent',async()=>{
 const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT)')
 let now=Date.parse('2026-10-19T12:00:00Z'),calls=0,fail=false
 const fetcher=async()=>{calls++;if(fail)throw Error('offline');return {ok:true,json:async()=>({base:'USD',quote:'PEN',date:'2026-10-19',rate:3.5})}}
 const read=exchangeRate(db,fetcher,()=>now)
 const [a,b]=await Promise.all([read(),read()]);assert.equal(a.rate,3.5);assert.equal(b.rate,3.5);assert.equal(calls,1)
 await read();assert.equal(calls,1)
 const restarted=exchangeRate(db,fetcher,()=>now);await restarted();assert.equal(calls,1)
 now+=3600001;fail=true;assert.equal((await read()).stale,true);assert.equal(calls,2)
 await read();assert.equal(calls,2)
 now+=8*86400000;await assert.rejects(read(),/moneda original/);db.close()
})
test('invalid provider rates never get stored',async()=>{
 const db=new DatabaseSync(':memory:');db.exec('CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT)')
 const read=exchangeRate(db,async()=>({ok:true,json:async()=>({rate:-1,base:'USD',quote:'PEN',date:'2026-10-19'})}))
 await assert.rejects(read());assert.equal(db.prepare('SELECT COUNT(*) AS n FROM settings').get().n,0);db.close()
})
