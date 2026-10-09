import test from 'node:test'
import assert from 'node:assert/strict'
import {createCatalogLoader} from '../src/services/catalogLoader.ts'

test('admin sections share one pending download and reuse its result', async () => {
  let requests=0, finish
  const loader=createCatalogLoader(()=>{requests++;return new Promise(resolve=>{finish=resolve})})
  const admin=loader.load(), table=loader.load(), poll=loader.load()
  assert.equal(requests,1)
  finish([{id:'saved-product'}])
  assert.deepEqual(await Promise.all([admin,table,poll]),Array(3).fill([{id:'saved-product'}]))
  await loader.load()
  assert.equal(requests,1)
})
test('saving invalidates cached products; failures can be retried', async () => {
  let requests=0
  const loader=createCatalogLoader(async()=>{requests++;if(requests===1)throw Error('offline');return [requests]})
  await assert.rejects(loader.load())
  assert.deepEqual(await loader.load(),[2])
  loader.invalidate()
  assert.deepEqual(await loader.load(),[3])
})
test('a response started before saving cannot replace the refreshed catalog', async()=>{
  let finish
  let requests=0
  const loader=createCatalogLoader(()=>++requests===1?new Promise(resolve=>{finish=resolve}):Promise.resolve(['new']))
  const old=loader.load();loader.invalidate()
  assert.deepEqual(await loader.load(),['new'])
  finish(['old']);await old
  assert.deepEqual(await loader.load(),['new'])
})
