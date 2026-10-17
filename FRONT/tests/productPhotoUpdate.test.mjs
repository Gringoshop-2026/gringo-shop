import test from 'node:test'
import assert from 'node:assert/strict'
import {productPhotoUpdate} from '../src/utils/productPhotoUpdate.ts'
test('editing price or text never processes or sends published photos',async()=>{
 let calls=0;const photos=['https://shop/api/products/one/images/0?v=original']
 const payload=await productPhotoUpdate(photos,[...photos],async images=>{calls++;return images.map(x=>x+'changed')})
 assert.equal(calls,0);assert.deepEqual(payload,{})
})
test('only new photos are processed, retaining published photos and order',async()=>{
 const original=['/old-a','/old-b'];const batches=[]
 const payload=await productPhotoUpdate(original,['/old-b','new'],async images=>{batches.push(images);return ['cutout']})
 assert.deepEqual(batches,[['new']]);assert.deepEqual(payload,{images:['/old-b','cutout'],image:'/old-b'})
})
test('removal including all photos does not run the processor',async()=>{
 const payload=await productPhotoUpdate(['/old'],[],async()=>{throw Error('must not process')})
 assert.deepEqual(payload,{images:[],image:''})
})
