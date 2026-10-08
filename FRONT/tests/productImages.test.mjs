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
