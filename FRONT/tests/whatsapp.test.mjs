import test from 'node:test'
import assert from 'node:assert/strict'
import {shopWhatsappUrl} from '../src/utils/whatsapp.ts'
test('links to the configured shop with the complete product message',()=>{
 const message='Hola, quiero reservar Cartera & bolso. Precio: S/ 120.00.'
 const url=new URL(shopWhatsappUrl('970 520 979',message))
 assert.equal(url.pathname,'/51970520979')
 assert.equal(url.searchParams.get('text'),message)
 assert.equal(shopWhatsappUrl('+51 970520979',message),url.href)
})
test('does not create a link to an absent or invalid recipient',()=>{
 assert.equal(shopWhatsappUrl('','Hola'),undefined)
 assert.equal(shopWhatsappUrl('123','Hola'),undefined)
})
