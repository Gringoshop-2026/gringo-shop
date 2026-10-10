import test from 'node:test'
import assert from 'node:assert/strict'
import {spawn} from 'node:child_process'
import {mkdtemp,rm} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {createServer} from 'node:net'

test('catalog separates photos, serves cacheable image bytes and protects restore',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'negroshop-delivery-'))
 const port=await new Promise(resolve=>{const s=createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))})})
 const server=spawn(process.execPath,['BACK/routes/httpServer.mjs'],{env:{...process.env,RAILWAY_VOLUME_MOUNT_PATH:directory,PORT:String(port),ADMIN_USER:'test',ADMIN_PASSWORD:'test-password'},stdio:'ignore'})
 const base=`http://127.0.0.1:${port}/api`
 try {
  for(let i=0;i<100;i++){try{if((await fetch(base+'/health')).ok)break}catch{}await new Promise(r=>setTimeout(r,25))}
  const auth=await(await fetch(base+'/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:'test',password:'test-password'})})).json()
  const headers={'content-type':'application/json',authorization:`Bearer ${auth.token}`}
  const image='data:image/png;base64,'+Buffer.alloc(1024*1024).toString('base64')
  const created=await fetch(base+'/products',{method:'POST',headers,body:JSON.stringify({name:'Test',category:'Test',price:100,images:[image,image]})});assert.equal(created.status,201)
  const response=await fetch(base+'/products?view=summary');const text=await response.text();assert.ok(text.length<1000)
  const [product]=JSON.parse(text);assert.equal(product.images.length,2);assert.ok(product.image.startsWith(base+'/products/'))
  const photo=await fetch(product.image);assert.equal(photo.headers.get('content-type'),'image/png');assert.match(photo.headers.get('cache-control'),/immutable/);assert.equal((await photo.arrayBuffer()).byteLength,1024*1024)
  const cached=await fetch(product.image,{headers:{'if-none-match':photo.headers.get('etag')}});assert.equal(cached.status,304)
  assert.equal((await fetch(base+'/restore',{method:'POST'})).status,401)
  const backup={products:[],orders:[],quotes:[],settings:{},users:[{id:'test',username:'test',password_hash:'test',role:'admin',active:1,created_at:'2026-10-09'}]}
  assert.equal((await fetch(base+'/restore',{method:'POST',headers,body:JSON.stringify(backup)})).status,409)
 } finally {server.kill();await new Promise(resolve=>server.once('exit',resolve));await rm(directory,{recursive:true,force:true})}
})
