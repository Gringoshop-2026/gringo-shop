import test from 'node:test'
import assert from 'node:assert/strict'
import {photoProcessingError} from '../src/utils/photoErrors.ts'
test('shows the failed photo, stage, actual reason and a useful recovery step',()=>{
 const message=photoProcessingError(new TypeError('Failed to fetch https://example.com/model?token=private'),2,'la eliminación del fondo')
 assert.match(message,/Foto 2/);assert.match(message,/eliminación del fondo/);assert.match(message,/conexión/);assert.match(message,/Failed to fetch/);assert.doesNotMatch(message,/private/)
})
test('distinguishes memory problems from an unknown cause',()=>{
 assert.match(photoProcessingError(new Error('out of memory'),1,'el recorte'),/sin memoria/)
 assert.match(photoProcessingError(new Error('unexpected failure'),1,'el recorte'),/Detalle: unexpected failure/)
})
