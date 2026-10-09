import test from 'node:test'
import assert from 'node:assert/strict'
import { cachedPhoto } from '../src/utils/photoCache.ts'

test('reuses repeated and simultaneous photos and recognizes finished cutouts', async () => {
  let calls = 0
  const process = async () => { calls++; return 'finished-cutout' }
  const [first, second] = await Promise.all([cachedPhoto('original-photo', process), cachedPhoto('original-photo', process)])
  assert.equal(first, second)
  assert.equal(await cachedPhoto('original-photo', process), 'finished-cutout')
  assert.equal(await cachedPhoto('finished-cutout', process), 'finished-cutout')
  assert.equal(calls, 1)
})

test('retries failed photos instead of caching errors', async () => {
  await assert.rejects(cachedPhoto('failed-photo', async () => { throw Error('failed') }))
  assert.equal(await cachedPhoto('failed-photo', async () => 'retried-cutout'), 'retried-cutout')
})
