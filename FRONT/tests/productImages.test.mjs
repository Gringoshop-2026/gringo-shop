import test from 'node:test'
import assert from 'node:assert/strict'
import { isHeicPhoto, isSupportedProductPhoto } from '../src/utils/productImages.ts'

test('accepts iPhone HEIC/HEIF photos with MIME or only filename', () => {
  for (const source of [
    { type: 'image/heic', name: 'IMG_0659.HEIC' },
    { type: 'image/heif', name: 'photo' },
    { type: 'image/heic-sequence', name: 'photo' },
    { type: '', name: 'Cartera.HEIC' },
    { type: 'application/octet-stream', name: 'Cartera.heif' },
  ]) {
    assert.equal(isHeicPhoto(source), true)
    assert.equal(isSupportedProductPhoto(source), true)
  }
})

test('preserves standard image formats and rejects other files', () => {
  for (const type of ['image/png', 'image/jpeg', 'image/webp']) {
    assert.equal(isSupportedProductPhoto({ type, name: 'photo' }), true)
    assert.equal(isHeicPhoto({ type, name: 'photo' }), false)
  }
  assert.equal(isSupportedProductPhoto({ type: 'application/pdf', name: 'photo.pdf' }), false)
})

test('optimizes photos when the browser falls back to large PNG output', async () => {
  const { optimizeProductImage } = await import('../src/utils/productImages.ts')
  const originals = { document: globalThis.document, createImageBitmap: globalThis.createImageBitmap, FileReader: globalThis.FileReader }
  let closed = false
  globalThis.createImageBitmap = async () => ({ width: 4000, height: 3000, close() { closed = true } })
  globalThis.document = { createElement() { return { width: 0, height: 0, getContext() { return { drawImage() {} } }, toBlob(callback) { callback(new Blob([new Uint8Array(this.width * this.height * 3)], { type: 'image/png' })) } } } }
  globalThis.FileReader = class { readAsDataURL(blob) { this.result = `data:${blob.type};base64,TEST`; this.onload() } }
  try {
    assert.match(await optimizeProductImage(new Blob([], { type: 'image/png' })), /^data:image\/png/)
    assert.equal(closed, true)
  } finally { Object.assign(globalThis, originals) }
})
