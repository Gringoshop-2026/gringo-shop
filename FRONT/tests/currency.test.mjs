import test from 'node:test'
import assert from 'node:assert/strict'
import {convertPrice} from '../src/utils/currency.ts'
test('converts both directions without modifying base prices or compounding',()=>{
 assert.equal(convertPrice(350,'PEN','USD',3.5),100)
 assert.equal(convertPrice(100,'USD','PEN',3.5),350)
 assert.equal(convertPrice(350,'PEN','PEN',3.5),350)
 assert.throws(()=>convertPrice(350,'PEN','USD',0))
})
